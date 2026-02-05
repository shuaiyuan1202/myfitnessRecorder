import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const { rows } = await sql`
      SELECT user_id, username, name, configuration, preferred_action 
      FROM "User" 
      WHERE username = ${username} AND password = ${password}
    `;

    if (rows.length > 0) {
      const user = rows[0];
      let config = user.configuration || {};
      if (typeof config === 'string') {
          try {
              config = JSON.parse(config);
          } catch (e) {
              config = {};
          }
      }
      if (!config.fs_app_token) config.fs_app_token = 'migrated_to_postgres';
      if (!config.fs_table_id) config.fs_table_id = 'migrated_to_postgres';

      let preferredAction = user.preferred_action || [];
      if (typeof preferredAction === 'string') {
          try {
              preferredAction = JSON.parse(preferredAction);
          } catch (e) {
              preferredAction = [];
          }
      }

      return res.status(200).json({ 
        success: true, 
        userConfig: {
          userId: user.user_id,
          username: user.username,
          nickname: user.name,
          configuration: config,
          preferredAction: preferredAction
        }
      });
    } else {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}

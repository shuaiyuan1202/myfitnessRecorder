import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  try {
    const { rows } = await sql`
      SELECT user_id, username, name, weight_kg, height_cm 
      FROM "User" 
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = rows[0];
    
    // Return the config structure expected by the frontend
    const userConfig = {
      userId: user.user_id,
      username: user.username,
      nickname: user.name,
      weight: user.weight_kg,
      height: user.height_cm
    };

    res.status(200).json({ success: true, userConfig });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

import { getTenantAccessToken, searchUserInTable } from './utils/lark.js';
import 'dotenv/config';

const LARK_MASTER_BASE_ID = process.env.LARK_MASTER_BASE_ID;
const LARK_USER_TABLE_ID = process.env.LARK_USER_TABLE_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const accessToken = await getTenantAccessToken();
    const userConfig = await searchUserInTable(accessToken, LARK_MASTER_BASE_ID, LARK_USER_TABLE_ID, username, password);

    if (userConfig) {
      return res.status(200).json({ success: true, userConfig });
    } else {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === '账号未启用') {
      return res.status(403).json({ success: false, error: '账号未启用' });
    }
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      larkError: error.response?.data 
    });
  }
}

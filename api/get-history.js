import { getTenantAccessToken, getRecords } from './utils/lark.js';
import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, appToken, tableId, range } = req.body;

  if (!userId || !appToken || !tableId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const accessToken = await getTenantAccessToken();
    const records = await getRecords(accessToken, appToken, tableId, userId, range);
    
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

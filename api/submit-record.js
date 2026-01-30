import { getTenantAccessToken, addRecord } from './utils/lark.js';
import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, appToken, tableId, trainingType, count } = req.body;

  if (!userId || !appToken || !tableId || !trainingType || !count) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const accessToken = await getTenantAccessToken();
    
    // Construct the record fields based on the schema
    const fields = {
        "user_id": userId,
        "training_types": trainingType,
        "count": count,
        "record_time": new Date().getTime()
    };

    const result = await addRecord(accessToken, appToken, tableId, fields);
    
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Submit record error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

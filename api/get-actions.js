import { getTenantAccessToken, getActionList } from './utils/lark.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Configuration for Actions Table
  const APP_TOKEN = 'NxM2bK3aCaZtq5snd8gcXA85nOc';
  const TABLE_ID = 'tblW0q82s19Cj9I8';

  try {
    const accessToken = await getTenantAccessToken();
    const actions = await getActionList(accessToken, APP_TOKEN, TABLE_ID);
    
    return res.status(200).json({ success: true, data: actions });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

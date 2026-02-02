import { getTenantAccessToken, getPumpData } from './utils/lark.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Hardcoded configuration for "Pump" feature
  const APP_TOKEN = 'NxM2bK3aCaZtq5snd8gcXA85nOc';
  const TABLE_ID = 'tblpt5Zhkc1tWlfx';
  // const VIEW_ID = 'vewCeu6iuZ';

  try {
    const accessToken = await getTenantAccessToken();
    const data = await getPumpData(accessToken, APP_TOKEN, TABLE_ID);
    
    // Pick one random item or return list for frontend to shuffle
    // Returning list allows frontend to implement "next card" logic without re-fetching
    
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error('Get pump data error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

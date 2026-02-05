import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, recordId } = req.body;

  if (!userId || !recordId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sql`
      DELETE FROM training_records 
      WHERE id = ${recordId} AND user_id = ${userId}
    `;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete record error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

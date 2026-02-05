import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM training_records 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 100
    `;
    const records = rows.map(row => {
        // Handle created_at as seconds (integer)
        const createdMs = typeof row.created_at === 'number' ? row.created_at * 1000 : new Date(row.created_at).getTime();
        
        return {
            id: row.id,
            createdTime: createdMs,
            fields: {
                training_types: row.training_types || row.action,
                count: row.count,
                record_time: createdMs,
                calories: row.calories,
                weight_lifted: row.weight_lifted
            }
        };
    });
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

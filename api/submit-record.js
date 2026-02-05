import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, trainingType, count, weightLifted, calories } = req.body;

  if (!userId || !trainingType || !count) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate a random 9-digit ID (safe for Postgres Integer max 2,147,483,647)
    let recordId;
    let exists = true;
    
    // Simple retry loop to ensure uniqueness
    while (exists) {
        // Range: 100,000,000 to 999,999,999
        recordId = Math.floor(Math.random() * 900000000) + 100000000;
        const { rows } = await sql`SELECT 1 FROM training_records WHERE id = ${recordId}`;
        if (rows.length === 0) exists = false;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const weight = weightLifted || 0; // Default to 0 if not provided
    const cal = calories || 0;

    const result = await sql`
      INSERT INTO training_records (id, user_id, training_types, count, created_at, record_time, weight_lifted, calories)
      VALUES (${recordId}, ${userId}, ${trainingType}, ${count}, ${timestamp}, ${timestamp}, ${weight}, ${cal})
      RETURNING *
    `;
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Submit record error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

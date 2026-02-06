import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId, height, weight } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  try {
    // Update User table
    // Note: Assuming height is height_cm and weight is weight_kg in DB based on previous files
    await sql`
      UPDATE "User"
      SET 
        height_cm = ${height || null},
        weight_kg = ${weight || null}
      WHERE user_id = ${userId}
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user info:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

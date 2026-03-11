import { put } from '@vercel/blob';
import { sql } from './utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId, dataUrl } = req.body || {};

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ success: false, error: 'Image data is required' });
  }

  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ success: false, error: 'Invalid image format' });
  }

  const contentType = match[1];
  const base64 = match[2];

  try {
    const buffer = Buffer.from(base64, 'base64');
    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';

    const blob = await put(`avatars/${userId}/${Date.now()}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    await sql`
      UPDATE "User"
      SET profile_image = ${blob.url}
      WHERE user_id = ${userId}
    `;

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

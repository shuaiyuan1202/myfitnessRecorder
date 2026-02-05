import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from '@vercel/postgres';

// Initialize environment variables immediately
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assuming file structure: api/utils/db.js
// Project root is two levels up
const rootDir = path.resolve(__dirname, '../../');

// Try to load .env.development.local first (for local dev with Vercel CLI generated files)
dotenv.config({ path: path.resolve(rootDir, '.env.development.local') });

// Then try to load .env (standard)
dotenv.config({ path: path.resolve(rootDir, '.env') });

export { sql };

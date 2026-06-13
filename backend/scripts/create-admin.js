/* =====================================================================
   Create (or update) a SkillAddis admin account.

   Registration can't create admins, so run this once to bootstrap the
   first superadmin. It connects using the same DATABASE_URL as the app.

   Usage (from the backend/ folder):
     node scripts/create-admin.js "Full Name" admin@example.com "StrongPass123"

   Or via env vars:
     ADMIN_NAME="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." node scripts/create-admin.js

   If the email already exists, it is upgraded to role=admin and its
   password is reset to the one you provide.
   ===================================================================== */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

async function main() {
    const full_name = process.argv[2] || process.env.ADMIN_NAME;
    const email = process.argv[3] || process.env.ADMIN_EMAIL;
    const password = process.argv[4] || process.env.ADMIN_PASSWORD;

    if (!full_name || !email || !password) {
        console.error('Usage: node scripts/create-admin.js "Full Name" email@example.com "password"');
        process.exit(1);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
        await db.query(
            'UPDATE users SET full_name = ?, password_hash = ?, role = \'admin\' WHERE email = ?',
            [full_name, password_hash, email]
        );
        console.log(`✓ Existing user "${email}" promoted to admin and password reset.`);
    } else {
        await db.query(
            'INSERT INTO users (user_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, \'admin\')',
            [uuidv4(), full_name, email, password_hash]
        );
        console.log(`✓ Admin "${email}" created.`);
    }

    process.exit(0);
}

main().catch((err) => {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
});

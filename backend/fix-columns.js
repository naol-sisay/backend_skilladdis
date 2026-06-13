require('dotenv').config();
const mysql = require('mysql2/promise');

async function addMissingColumns() {
    try {
        const db = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        console.log("Building missing columns in the users table...");
        
        // This adds the exact columns your Express backend is looking for
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN headline VARCHAR(255) NULL,
            ADD COLUMN bio TEXT NULL,
            ADD COLUMN phone VARCHAR(50) NULL,
            ADD COLUMN location VARCHAR(255) NULL;
        `);

        console.log("SUCCESS: Columns built. Your app will no longer crash.");
        await db.end();
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("The columns already exist.");
        } else {
            console.error("FAILED:", err.message);
        }
    }
}

addMissingColumns();
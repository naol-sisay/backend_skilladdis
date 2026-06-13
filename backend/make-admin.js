require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function createAdmin() {
    // 1. Set your hardcoded credentials here
    const name = "System Admin";
    const email = "naolsisay3@gmail.com";
    const plainTextPassword = "Password123#"; 

    try {
        console.log("Hashing password...");
        const hash = await bcrypt.hash(plainTextPassword, 10);
        const uuid = crypto.randomUUID();

        console.log("Connecting to database...");
        const db = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        console.log("Injecting admin record...");
        await db.query(
            `INSERT INTO users (user_id, full_name, email, password_hash, role) 
             VALUES (?, ?, ?, ?, 'admin')`,
            [uuid, name, email, hash]
        );

        console.log("SUCCESS: Admin injected. You can now log in.");
        await db.end();
    } catch (err) {
        console.error("FAILED:", err.message);
    }
}

createAdmin();
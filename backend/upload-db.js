require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

async function uploadDatabase() {
    try {
        const db = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            multipleStatements: true 
        });

        console.log("1. Wiping old Prisma tables...");
        // This drops everything so the import has a clean slate
        await db.query("SET FOREIGN_KEY_CHECKS = 0; DROP DATABASE IF EXISTS defaultdb; CREATE DATABASE defaultdb; USE defaultdb; SET FOREIGN_KEY_CHECKS = 1;");

        console.log("2. Reading backup.sql and uploading...");
        let sql = fs.readFileSync('backup.sql', 'utf8');
        sql = "SET FOREIGN_KEY_CHECKS = 0;\n" + sql + "\nSET FOREIGN_KEY_CHECKS = 1;";
        
        await db.query(sql);
        
        console.log("SUCCESS: Cloud database wiped and restored.");
        await db.end();
    } catch (err) {
        console.error("Migration failed:", err.message);
    }
}

uploadDatabase();
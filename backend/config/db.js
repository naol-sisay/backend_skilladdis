// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool using your single Aiven connection string
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // Bypasses strict cert validation on Render
    }
});

// Test the connection asynchronously
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database via Pool.');
        connection.release();
    } catch (err) {
        console.error('Database connection failed: ' + err.message);
    }
})();

module.exports = pool;
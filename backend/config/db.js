// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool configured for cloud database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false // Required for cloud databases like Aiven/Render
    }
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database via Pool.');
    connection.release();
});

// Export it so other files can use this connection
module.exports = db.promise();
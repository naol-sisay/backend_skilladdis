// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    // 1. Grab the data sent from the React frontend.
    //    Credentials are required; the profile fields are optional (the
    //    signup wizard lets users skip them and fill them in later).
    const { full_name, email, password, role, phone, headline, location, bio } = req.body;

    // 2. Make sure the required fields aren't blank
    if (!full_name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // 3. Secure the password
        // A "salt" adds random data before hashing so identical passwords look different
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Generate a unique ID
        const user_id = uuidv4();

        // 5. Write the SQL query — include the optional profile fields,
        //    normalising blank/missing values to NULL.
        const query = `INSERT INTO users
                (user_id, full_name, email, password_hash, role, phone, headline, location, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // 6. Execute the query in MySQL
        await db.query(query, [
            user_id, full_name, email, password_hash, role,
            phone?.trim() || null,
            headline?.trim() || null,
            location?.trim() || null,
            bio?.trim() || null,
        ]);

        // 7. Tell the frontend it worked
        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        // If the email is already in the database, MySQL throws an ER_DUP_ENTRY error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Verify the request has data
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // 2. Find the user in the database
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.query(query, [email]);

        // If the array is empty, the email does not exist
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // 3. Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 4. Generate the JWT (The "Wristband")
        // We pack the user_id and role inside the token so the frontend knows who is logged in
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, name: user.full_name },
            process.env.JWT_SECRET,
           
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // 5. Send the token back to the frontend
        res.status(200).json({
            success: true,
            token: token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
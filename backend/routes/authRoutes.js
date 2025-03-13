// authRoutes.js
const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        res.json({ message: 'Database connected', result: rows });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
});


module.exports = router;

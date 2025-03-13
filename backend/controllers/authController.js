const bcrypt = require('bcrypt');
const pool = require('../config/db'); 

// Login function (using email instead of username)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.status(200).json({
        message: 'Login successful!',
        userId: user.id,
        username: user.username,
        email: user.email,
      });
    } else {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Register function (creates username, email, and password)
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'Registration successful! Please log in.',
      userId: result.insertId,
    });
  } catch (err) {
    console.error('Error during registration:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email or username already exists.' });
    }

    return res.status(500).json({ message: 'Failed to register user. Please try again.' });
  }
};

module.exports = { loginUser, registerUser };

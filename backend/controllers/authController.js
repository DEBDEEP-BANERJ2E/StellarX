const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Adjust the path to your database configuration file

// Login function
const loginUser = async (req, res) => {
  //console.log('Login request received:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password FROM students WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.status(200).json({ message: 'Login successful', userId: user.id });
    } else {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Register function
const registerUser = async (req, res) => {
  //console.log('Registration request received:', req.body);
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT * FROM students WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO students (username, password, email, created_at) VALUES (?, ?, ?, NOW())',
      [username, hashedPassword, email]
    );

    return res.status(201).json({
      message: 'Registration successful! Welcome aboard!',
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

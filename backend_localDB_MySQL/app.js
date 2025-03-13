// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db'); // Importing the database connection
const cors = require('cors');


const app = express();

app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

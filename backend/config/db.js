const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Use environment variables
    user: process.env.DB_USER, // Your MySQL user
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: process.env.DB_NAME, // Your database name
});


module.exports = pool.promise(); // Using promise-based API for async/await support

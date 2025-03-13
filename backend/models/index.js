const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

// Use environment variables for the database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
    }
);

// Test database connection
sequelize
    .authenticate()
    .then(() => console.log('MySQL database connected successfully!'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = { sequelize };

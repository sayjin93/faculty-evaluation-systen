const express = require('express');
const morgan = require('morgan'); // HTTP request logger middleware
const helmet = require('helmet'); // Security middleware to set various HTTP headers
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const db = require('./models'); // Import the Sequelize instance and models

require('dotenv').config(); // Load environment variables from .env file
require('./auth/passport'); // Initialize Passport for authentication

const middlewares = require('./middlewares'); // Custom middlewares
const routes = require('./routes'); // Import the main router

const app = express();

// Middleware to parse URL-encoded data and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP request logger, security headers, and CORS setup
app.use(morgan('dev')); // Logs requests to the console
app.use(helmet()); // Adds various security-related headers to responses
app.use(cors()); // Enables CORS for all routes

// Test database connection and synchronize (optional)
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.'.bgBlue);

    // Sync the database (only in development, use migrations in production)
    if (process.env.NODE_ENV !== 'production') {
      db.sequelize.sync()
        .then(() => {
          console.log('Database synchronized successfully.'.bgGreen);
        })
        .catch((err) => {
          console.error('Error synchronizing the database:', err);
        });
    }
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Test route to ensure the server is running
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

// Mount the API routes under the /api/v1 prefix
app.use('/api/v1', routes);

// Custom middlewares for handling 404 errors and other errors
app.use(middlewares.notFound); // Middleware to handle 404 errors
app.use(middlewares.errorHandler); // Global error handling middleware

module.exports = app;

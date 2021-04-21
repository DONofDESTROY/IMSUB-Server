const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// load env variables
dotenv.config({ path: 'config/config.env' });

// Connect Database
connectDB();

// Route files
const IMSUB = require('./routes/IMSUB');

const app = express();

// Body parser
app.use(express.json());

// Dev env logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount the routes
app.use('/api/v1/operations', IMSUB);

app.get('/api/v1/', (req, res) => {
  res.status(200).json({ page: 'main page' });
});
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

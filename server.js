const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
var cors = require('cors');

const corsConfig = {
  origin: true,
  credentials: true,
};

// load env variables
dotenv.config({ path: 'config/config.env' });

// Connect Database
connectDB();

// Route files
const IMSUB = require('./routes/IMSUB');
const auth = require('./routes/auth');

const app = express();

// Avoid cors errors and set cookies
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev env logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount the routes
app.use('/api/v1/operations', IMSUB);
app.use('/api/v1/auth', auth);

// Error Handeling
app.use(errorHandler);

// Root route
app.get('/api/v1/', (req, res) => {
  res.status(200).json({ page: 'main page' });
});

const PORT = process.env.PORT || 5000;

// Start the server and listen
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Log the unhandled Error to the console for the developer
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  if (err.code === 'ECONNREFUSED') {
    // Close server & exit process
    console.log("Can't connect to DB closing".red.bold.inverse);
    server.close(() => process.exit(1));
  }
});

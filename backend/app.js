const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const {errorHandler} = require('./middleware/errorMiddleware');
const { sessionConfig } = require('./config/session');

const app = express();
const allowedOrigins = [
  'https://blog-47yifnclm-indrayudh-dharas-projects.vercel.app',
  'https://blog-app-seven-tan.vercel.app'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
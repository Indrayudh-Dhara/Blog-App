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
  'https://blog-app-seven-tan.vercel.app',
  'https://blog-app-git-main-indrayudh-dharas-projects.vercel.app'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie'] 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.get('/api/debug/session', (req, res) => {
  console.log('=== SESSION DEBUG ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('Request cookies:', req.headers.cookie);
  
  res.json({
    sessionExists: !!req.session.userId,
    sessionId: req.sessionID,
    cookiesReceived: req.headers.cookie || 'none'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
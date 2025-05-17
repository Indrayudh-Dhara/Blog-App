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
app.set('trust proxy', 1);
const allowedOrigins = [
  'https://blog-app-seven-tan.vercel.app',
  
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
   exposedHeaders: ['set-cookie','chrome-partitioned']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use((req, res, next) => {
  console.log('Incoming cookies:', req.headers.cookie);
  next();
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: process.env.NODE_ENV === 'production' 
    ? '.onrender.com' // Leading dot for subdomains
    : undefined // Local development

  }
};

module.exports = { sessionConfig };
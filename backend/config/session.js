const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
     crypto :{
        secret: process.env.SECRET,
     },
     touchAfter: 24*3600, 
    collectionName: 'sessions'
  }),
  cookie: {
    expires: Date.now()+ 7*24*60*60*1000, // 1 week
    maxAge :  7*24*60*60*1000,
    httpOnly: true,
  }
};

module.exports = { sessionConfig };
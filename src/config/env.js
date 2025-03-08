require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 3000,
    db: process.env.DB_CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET 
  },
  production: {
    port: process.env.PORT,
    db: process.env.DB_CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET
  }
};

module.exports = config[env];

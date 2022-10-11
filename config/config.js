require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DDB_USERNAME,
    password: process.env.DDB_PASSWORD,
    database: process.env.DDB_NAME,
    host: process.env.DDB_HOST,
    dialect: 'mysql',
    port: 3306,
  },
  test: {
    username: process.env.DDB_USERNAME,
    password: process.env.DDB_PASSWORD,
    database: process.env.DDB_NAME,
    host: process.env.DDB_HOST,
    dialect: 'mysql',
    port: 3306,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
};
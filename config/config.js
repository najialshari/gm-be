require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DDB_USERNAME,
    password: process.env.DDB_PASSWORD,
    database: process.env.DDB_NAME,
    host: process.env.DDB_HOST,
    dialect: process.env.DDB_DIALECT,
    port: process.env.DDB_PORT,
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
    username: process.env.PDB_USERNAME,
    password: process.env.PDB_PASSWORD,
    database: process.env.PDB_NAME,
    host: process.env.PDB_HOST,
    dialect: process.env.PDB_DIALECT,
    port: process.env.PDB_PORT,
  }
};
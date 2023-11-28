require('dotenv').config();

module.exports = {
  // development: {
  //   username: process.env.DDB_USERNAME,
  //   password: process.env.DDB_PASSWORD,
  //   database: process.env.DDB_NAME,
  //   host: process.env.DDB_HOST,
  //   dialect: 'mysql',
  //   port: 3306,
  // },
  development: {
    username: process.env.PGDDB_USERNAME,
    password: process.env.PGDDB_PASSWORD,
    database: process.env.PGDDB_NAME,
    host: process.env.PGDDB_HOST,
    dialect: 'postgres',
    port: 5432,
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
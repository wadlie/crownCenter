dotenv = require('dotenv').config()

module.exports = {
  development: {
    dialect: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    saltRounds: 2,
    jwtSecret: 'yo-its-a-secret',
    tokenExpireTime: '6h',
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: "postgres",
    username: "dev_admin@crowndb-dev",
    password: "crownpostgres1!",
    database: "api",
    host: "crowndb-dev.postgres.database.usgovcloudapi.net",
    saltRounds: 2,
    jwtSecret: 'yo-its-a-secret',
    tokenExpireTime: '6h'
  }
};



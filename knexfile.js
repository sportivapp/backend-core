const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'db');

module.exports = {
  development: {
    client: 'postgres',
    connection: 'postgres://postgres:postgres@localhost:5432/sportiv',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    useNullAsDefault: true
  }
};

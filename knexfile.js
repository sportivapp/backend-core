const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'db');

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};

const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'db');

module.exports = {
  test: {
    client: 'postgres',
    connection: 'postgres://postgres:12345678@localhost:5432/emtiv_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },

  development: {
    client: 'postgres',
    connection: 'postgres://emtivdev:12345678@103.253.113.217:5555/emtiv_dev',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};
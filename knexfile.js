const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'db');

module.exports = {
  development: {
    client: 'postgres',
    connection: 'postgres://fybpgjrhtopkns:db290aff96ec10b4a90714bdff11f3d474b01fca3778c689467406e9d66a9120@ec2-34-233-64-238.compute-1.amazonaws.com:5432/d47qb0d8n2jbd',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};

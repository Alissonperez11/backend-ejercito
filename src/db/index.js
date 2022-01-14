const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'militarh',
  password: 'admin',
  port: 5432,
});

module.exports = { pool }
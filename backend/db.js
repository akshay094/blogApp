// require('dotenv').config({ path: __dirname + '.env' })

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blog',
  password: 'pneumatic',
  port: '5432'
});

module.exports = pool;
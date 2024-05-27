const Pool = require('pg').Pool

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: 'threads',
  password: "pwd", 
  port: 5432,
})

module.exports = pool;

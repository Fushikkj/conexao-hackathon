const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'conecta_daniel',
    password: 'senai',
    port: 5432
});

module.exports = pool;
const mysql = require('mysql2');

const pool = mysql.createPool({
    user:'root',
    host:'localhost',
    database:'modern_tech',
    password: 'Taaraa.sql.1'
});
module.exports = pool;
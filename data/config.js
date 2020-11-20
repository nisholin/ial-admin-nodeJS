const mysql = require('mysql');

// Set database connection credentials
const config = {
    host:'localhost',
    user:'root',
    password:'',
    database:'ial_canteen'
}
//For efficiency, we're going to create a MySQL pool, which allows us to use multiple connections at once instead of having to manually open and close multiple connections. 
//Create a MySQL pool

const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
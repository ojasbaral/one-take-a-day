const Pool = require('pg').Pool 

const pool = new Pool({
    /* user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB   */
    connectionString: process.env.DB_URL + "?ssl=true"
})

pool.connect((err) => {
    if (err){
        throw err
    } else{
    console.log("[DB CONNECTED]")
    }
})

module.exports = pool
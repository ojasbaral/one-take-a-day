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
    pool.query("INSERT INTO account (email, password, username, display_name) VALUES ($1, $2, $3, $4)", ['oj@gmail.com', '12345678', 'oj', 'oj'])
    }
})

module.exports = pool
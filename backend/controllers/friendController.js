const pool = require('../db')

const getFriends = async (req, res) => {
    try{
        const { id } = req.params

        const following = await pool.query("SELECT a.user_id, a.username, a.display_name FROM friend f INNER JOIN account a ON f.account_b_id = a.user_id WHERE account_a_id=$1", [id])
        const followers = await pool.query("SELECT a.user_id, a.username, a.display_name FROM friend f INNER JOIN account a ON f.account_a_id = a.user_id WHERE account_b_id=$1", [id])

        return res.send({ message: "success", following: following.rows, followers: followers.rows })
    }catch(e){
        return res.send(e)
    }
}

const searchUsers = async (req, res) => {
    try{
        const { word } = req.params
        const resp = await pool.query("SELECT user_id, username, display_name FROM account WHERE username LIKE $1 ORDER BY (LENGTH(username) - LENGTH($2))", ['%'+word+'%',word])
        return res.send({ message: "success", queries: resp.rows })
    }catch(e){
        return res.send(e)
    }
}

module.exports = { getFriends, searchUsers }
const pool = require('../db')

const addLike = async (req, res) => {
    try{
        const { post_id, user_id } = req.body
        await pool.query("INSERT INTO likes (post_id, account_id) VALUES ($1, $2)", [post_id, user_id])
        await pool.query("UPDATE post SET like_count = like_count + 1 WHERE post_id=$1", [post_id])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

const delLike = async (req, res) => {
    try{
        const { post_id, user_id } = req.body
        await pool.query("DELETE FROM likes WHERE post_id=$1 AND account_id=$2", [post_id, user_id])
        await pool.query("UPDATE post SET like_count = like_count - 1 WHERE post_id=$1", [post_id])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

const getLike = async (req, res) => {
    try{
        const { post_id, user_id } = req.params
        const res = await pool.query("SELECT * FROM likes WHERE post_id=$1 AND account_id=$2 LIMIT 1", [post_id, user_id])
        if(res.rowCount === 0){
            return res.send({message: false})
        }else{
            return res.send({message: true})
        }
    }catch(e){
        return res.send(e)
    }
}

module.exports = { addLike, delLike, getLike }
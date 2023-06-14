const pool = require('../db')

const addComment = async (req, res) => {
    try{
        const { post_id, user_id, comment } = req.body
        await pool.query("INSERT INTO comments (post_id, account_id, comment) VALUES ($1, $2, $3)", [post_id, user_id, comment])
        await pool.query("UPDATE post SET comment_count = comment_count + 1 WHERE post_id=$1", [post_id])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

const delComment = async (req, res) => {
    try{
        const { post_id, user_id } = req.body
        await pool.query("DELETE FROM comments WHERE post_id=$1 AND account_id=$2", [post_id, user_id])
        await pool.query("UPDATE post SET like_count = like_count - 1 WHERE post_id=$1", [post_id])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

const getComment = async (req, res) => {
    try{
        const { post_id } = req.params
        const resp = await pool.query("SELECT c.comment, c.account_id, a.username, a.display_name FROM comments c INNER JOIN account a ON a.user_id = c.account_id WHERE post_id=$1", [post_id])
        const post = await pool.query("SELECT * FROM post WHERE post_id=$1", [post_id])
        return res.send({ message: "success", comments: resp.rows, curr_post: post.rows[0] })
    }catch(e){
        return res.send(e)
    }

}

module.exports = { addComment, delComment, getComment }
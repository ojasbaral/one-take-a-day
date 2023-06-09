const pool = require('../db')

const addPost = async (req, res) => {
    try{
        const { user_id, content, hashtags } = req.body

        const test = await pool.query("SELECT posted FROM post WHERE account_id=$1 ORDER BY posted DESC LIMIT 1", [user_id])
        if(test.rowCount !== 0){
            const currentDate = new Date()
            if((currentDate.getFullYear() === test.rows[0].posted.getFullYear()) && (currentDate.getMonth() === test.rows[0].posted.getMonth()) && (currentDate.getDate() ===  test.rows[0].posted.getDate())){
                return res.send({ message: "already posted" })
            }
        } 
        const post = await pool.query("INSERT INTO post (account_id, content) VALUES ($1, $2) RETURNING *", [user_id, content])
        for(const hashtag of hashtags){
            const result = await pool.query("SELECT * FROM hashtag WHERE hashtag=$1", [hashtag.toLowerCase()])
            if(result.rowCount === 0){
                const new_hashtag = await pool.query("INSERT INTO hashtag (hashtag, usage) VALUES ($1, $2) RETURNING *", [hashtag.toLowerCase(), 1])
                await pool.query("INSERT INTO hashtag_post (hashtag_id, post_id) VALUES ($1, $2) RETURNING *", [new_hashtag.rows[0].hashtag_id, post.rows[0].post_id])
            }else{
                await pool.query("INSERT INTO hashtag_post (hashtag_id, post_id) VALUES ($1, $2) RETURNING *", [result.rows[0].hashtag_id, post.rows[0].post_id])
                await pool.query("UPDATE hashtag SET usage = usage + 1 WHERE hashtag_id=$1", [result.rows[0].hashtag_id])
            }
        }

        return res.send({ message: "success" })
    } catch (e) {
        res.send(e)
    }
}

module.exports = { addPost }
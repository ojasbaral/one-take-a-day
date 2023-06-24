const pool = require('../db')

const getAccount = async (req, res) => {
    try{
        const { user_id, viewer_id } = req.params
        var content = []
        var following = true
        const relationship = await pool.query("SELECT * FROM friend WHERE account_a_id=$1 AND account_b_id=$2", [viewer_id, user_id])
        if (relationship.rowCount === 0){
            following = false
        }
        const posts = await pool.query("SELECT * FROM post p INNER JOIN account a ON a.user_id = p.account_id WHERE account_id=$1 ORDER BY posted DESC", [user_id])
        if (posts.rowCount === 0){
            content = []
        }else{
            for (const row in posts.rows){
                hashtags = []
                liked = true
                const res = await pool.query("SELECT * FROM hashtag_post hp INNER JOIN hashtag h ON h.hashtag_id = hp.hashtag_id WHERE post_id=$1", [posts.rows[row].post_id])
                for (const row in res.rows){
                    hashtags.push({
                        hashtag: res.rows[row].hashtag,
                        hashtag_id: res.rows[row].hashtag_id
                    })
                }
                const like_res = await pool.query("SELECT * FROM likes WHERE post_id=$1 AND account_id=$2", [posts.rows[row].post_id, viewer_id])
                
                if (like_res.rowCount === 0){
                    liked = false
                } 
                content.push({
                    post_id: posts.rows[row].post_id,
                    user_id: posts.rows[row].account_id,
                    posted: posts.rows[row].posted,
                    content: posts.rows[row].content,
                    username: posts.rows[row].username,
                    display_name: posts.rows[row].display_name,
                    like_count: posts.rows[row].like_count,
                    comment_count: posts.rows[row].comment_count,
                    hashtags: hashtags,
                    liked: liked
                })
            }
    }

    const user = await pool.query("SELECT user_id, bio, display_name, username FROM account WHERE user_id=$1", [user_id])
    return res.send({ posts: content, user: user.rows[0], message: "success", following: following })
    }catch(e){  
        return res.send(e)
    }
}

const addFriend = async (req, res) => {
    try{
        const { follower, following } = req.body
        await pool.query("INSERT INTO friend (account_a_id, account_b_id) VALUES ($1, $2)", [follower, following])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

const delFriend = async (req, res) => {
    try{
        const { follower, following } = req.body
        await pool.query("DELETE FROM FRIEND WHERE account_a_id=$1 AND account_b_id=$2", [follower, following])
        return res.send({ message: "success" })
    }catch(e){
        return res.send(e)
    }
}

module.exports = { getAccount, addFriend, delFriend }
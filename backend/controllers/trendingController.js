const pool = require('../db')

const getTrending = async (req, res) => {
    try{
        const { id } = req.params
        var content = []
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1)
        const day = String(today.getDate())
        const hashtagsQ = await pool.query("SELECT hashtag_id, hashtag FROM hashtag ORDER BY usage DESC LIMIT 10")
        const posts = await pool.query("SELECT p.post_id, p.account_id, p.posted, p.content, p.like_count, p.comment_count, a.username, a.display_name FROM post p INNER JOIN account a ON a.user_id = p.account_id WHERE posted=$1 order by like_count DESC LIMIT 20", [year + "-" + month + '-' + day])

        for (const row in posts.rows){
            var hashtags = []
            var liked = true
            var resp = await pool.query("SELECT * FROM hashtag_post hp INNER JOIN hashtag h ON h.hashtag_id = hp.hashtag_id WHERE post_id=$1", [posts.rows[row].post_id])
            for (const row in resp.rows){
                hashtags.push({
                    hashtag: resp.rows[row].hashtag,
                    hashtag_id: resp.rows[row].hashtag_id
                })
            }
            const like_res = await pool.query("SELECT * FROM likes WHERE post_id=$1 AND account_id=$2", [posts.rows[row].post_id, id])
            
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

        return res.send({ message: "success", hashtags: hashtagsQ.rows, posts: content })
    }catch(e){
        return res.send(e)
    }
}

const searchHashtags = async (req, res) => {
    try{
        const { word } = req.params
        const resp = await pool.query("SELECT * FROM hashtag WHERE hashtag LIKE $1 ORDER BY (LENGTH(hashtag) - LENGTH($2))", ['%'+word+'%',word])
        return res.send({ message: "success", queries: resp.rows })
    }catch(e){
        return res.send(e)
    }
}

const getHashtag = async (req, res) => {
    try{
        const { hashtag_id, user_id } = req.params
        var content = []
        const hashtag = await pool.query("SELECT hashtag FROM hashtag WHERE hashtag_id=$1", [hashtag_id])
        const posts = await pool.query("SELECT * FROM hashtag_post h INNER JOIN post p ON p.post_id = h.post_id INNER JOIN account a ON a.user_id = p.account_id WHERE hashtag_id=$1 ORDER BY p.like_count DESC LIMIT 50", [hashtag_id])

        for (const row in posts.rows){
            var hashtags = []
            var liked = true
            var resp = await pool.query("SELECT * FROM hashtag_post hp INNER JOIN hashtag h ON h.hashtag_id = hp.hashtag_id WHERE post_id=$1", [posts.rows[row].post_id])
            for (const row in resp.rows){
                hashtags.push({
                    hashtag: resp.rows[row].hashtag,
                    hashtag_id: resp.rows[row].hashtag_id
                })
            }
            const like_res = await pool.query("SELECT * FROM likes WHERE post_id=$1 AND account_id=$2", [posts.rows[row].post_id, user_id])
            
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

        return res.send({ message: "success", posts: content, hashtag: hashtag.rows[0].hashtag})

    }catch(e){
        return res.send(e)
    }
}

module.exports = { getTrending, searchHashtags, getHashtag }
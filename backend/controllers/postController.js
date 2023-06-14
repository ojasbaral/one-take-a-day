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


const getPost = async (req,res) => {
    try{
    var posted = false
    var message = 'success'
    var content = []
    var currentPost = {}
    var liked = false
    const { id, page } = req.params
    var test = await pool.query("SELECT p.like_count, p.comment_count, p.post_id, p.like_count, p.comment_count, p.account_id, p.posted, p.content, a.username, a.display_name FROM post p INNER JOIN account a ON a.user_id = p.account_id WHERE account_id=$1 ORDER BY posted DESC LIMIT 1", [id])
    if(test.rowCount !== 0){
        const currentDate = new Date()
        if((currentDate.getFullYear() === test.rows[0].posted.getFullYear()) && (currentDate.getMonth() === test.rows[0].posted.getMonth()) && (currentDate.getDate() ===  test.rows[0].posted.getDate())){
            posted = true
            currentPost = test.rows[0]
            const x = await pool.query("SELECT * FROM likes WHERE post_id=$1 AND account_id=$2", [currentPost.post_id, id])
            if (x.rowCount !== 0){
                liked=true
            }
        }
    }

    if (currentPost != {}){
        currentPost['hashtags'] = []
        const res = await pool.query("SELECT * FROM hashtag_post hp INNER JOIN hashtag h ON h.hashtag_id = hp.hashtag_id WHERE post_id=$1", [currentPost.post_id])
        for (const row in res.rows){
            currentPost['hashtags'].push({
                hashtag: res.rows[row].hashtag,
                hashtag_id: res.rows[row].hashtag_id
            })
        }
    }
    
    const bottom = (page-1) * 25
    const posts = await pool.query("SELECT p.post_id, p.comment_count, p.like_count, p.account_id, p.posted, p.content, a.username, a.display_name FROM post p INNER JOIN account a ON a.user_id = p.account_id WHERE a.user_id IN (SELECT account_b_id FROM friend WHERE account_a_id=$1) ORDER BY p.posted DESC OFFSET $2 LIMIT 25", [id, bottom])
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
    
}

    return res.send({ message: message, content: content, posted: posted, current_post: currentPost, current_liked: liked })
} catch (e){
    return res.send(e)
}

}

const delPost = async (req, res) => {
    try{
        const { post_id } = req.body
        await pool.query("DELETE FROM post WHERE post_id=$1", [post_id])
        return res.send({ message: "success" })
    } catch (e) {
        return res.send(e)
    }

}

module.exports = { addPost, getPost, delPost }
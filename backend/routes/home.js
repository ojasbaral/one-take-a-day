const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const likeController = require('../controllers/likeController')
const commentController = require('../controllers/commentController')
const accountController = require('../controllers/accountController')
const friendController = require('../controllers/friendController')
const trendingController = require("../controllers/trendingController")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtAccessPass = process.env.JWT_ACCESS_PASS

router.use((req, res, next) => {
    if(req.cookies.access_token){
        const access_token = req.cookies.access_token

        jwt.verify(access_token, jwtAccessPass, function(err, decoded){
            if(err){
                return res.status(401).send({ message: "unauthorized"})
            }else{
                next()
            }
        })

    } else {
        return res.status(401).send({ message: 'unauthorized'})
    }
})

router.post('/post', postController.addPost)

router.get('/post/:id/:page', postController.getPost)

router.delete('/post', postController.delPost)


router.post('/like', likeController.addLike)

router.delete('/like', likeController.delLike)

router.get('like/:post_id/:user_id', likeController.getLike)


router.post('/comment', commentController.addComment)

router.delete('/comment', commentController.delComment)

router.get('/comment/:post_id/:user_id', commentController.getComment)


router.get('/account/:user_id/:viewer_id', accountController.getAccount)

router.post('/friend', accountController.addFriend)

router.delete('/friend', accountController.delFriend)

router.get('/friend/:id', friendController.getFriends)

router.get('/search/:word', friendController.searchUsers)

router.get('/trending/:id', trendingController.getTrending)

router.get('/search/hashtag/:word', trendingController.searchHashtags)

router.get('/hashtag/:hashtag_id/:user_id', trendingController.getHashtag)


module.exports = router
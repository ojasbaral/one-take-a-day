const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const likeController = require('../controllers/likeController')
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


module.exports = router
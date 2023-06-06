const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/register/:email', userController.registerStepOne)

router.post('/register', userController.registerStepTwo)

router.post('/refresh', userController.refresh)

router.post('/login', userController.checkLoginAuth, userController.login)

router.get('/logout', userController.checkLogoutAuth, userController.logout)

module.exports = router
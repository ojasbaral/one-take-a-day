const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const saltRounds = process.env.BCRYPT_SALT
const jwtAccessPass = process.env.JWT_ACCESS_PASS
const jwtRefreshPass = process.env.JWT_REFRESH_PASS

const state = true

function genJwt(user, res){
    const accessToken = jwt.sign({ user_id: user.rows[0].user_id }, jwtAccessPass, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ user_id: user.rows[0].user_id }, jwtRefreshPass, { expiresIn: "7d"})

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: (15 * 60 * 1000),
        sameSite: 'None',
        secure: state
    })

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60 * 1000),
        sameSite: 'None',
        secure: state,
        path: '/auth'
    })
}

function checkLoginAuth(req, res, next){
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (err){
                next()
            } else {
                return res.send({ message: 'already authorized', id: decoded.user_id})
            }
        })
    } else {
        next()
    }
}

function checkLogoutAuth(req, res, next) {
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (err){
                return res.status(401).send({ message: "unauthorized" })
            } else {
                next()
            }
        })
    } else {
        return res.send({ message: "unauthorized" })
    }
}

const registerStepOne = async (req, res) => {
    try{
        const email = req.params.email
        const user = await pool.query("SELECT * FROM account WHERE email=$1", [email.toLowerCase()])
        if(user.rowCount === 0){
            return res.send({ message: "success" })
        }else{
            return res.send({ message: "failure" })
        }
    }catch(e){
        return res.send(e)
    }
    
}

const registerStepTwo = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const username = req.body.username
        const displayName = req.body.displayName
        const bio = req.body.bio

        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds))

        const test_user = await pool.query("SELECT * FROM account WHERE username=$1", [username.toLowerCase()])
        if(test_user.rowCount !== 0){
            return res.send({ message: "username already in use"})
        }
        const user = await pool.query("INSERT INTO account (email, password, username, display_name, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *", [email.toLowerCase(), hashedPassword, username.toLowerCase(), displayName, bio])
        genJwt(user, res)

        return res.send({ message: "success", id: user.rows[0].user_id })
    } catch (e) {
        return res.send(e)
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await pool.query("SELECT * FROM account WHERE username=$1", [username.toLowerCase()])
        if(user.rowCount !== 0){
            const verified = await bcrypt.compare(password, user.rows[0].password)
            if(verified){
                genJwt(user, res)
                console.log(user)
                return res.send({ message: "success", id: user.rows[0].user_id})
            }
        }
        return res.send({ message: 'unauthorized' })
    } catch (e) {
        return res.send({ message: 'error' })
    }
}

const refresh = (req, res) => {
    const { user_id } = req.body
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (user_id.toString() !== decoded.user_id.toString()){
                return res.send({message: "unauthorized"})
            }
            if (err){
                return res.send({ message: 'unauthorized'})
            } else {
                const accessToken = jwt.sign({ user_id: decoded.user_id }, jwtAccessPass, { expiresIn: "15m" })

                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    maxAge: (5 * 60 * 1000),
                    sameSite: 'None',
                    secure: state
                })

                return res.send({ message: 'success'})

            }
        })
    } else {
        return res.send({ message: 'unauthorized'})
    }
}

const logout = (req, res) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60 * 1000),
        sameSite: 'None',
        secure: state,
        path: '/auth'
    })
    res.clearCookie('access_token', {
                    httpOnly: true,
                    maxAge: (15 * 60 * 1000),
                    sameSite: 'None',
                    secure: state
                })
    res.send({ message: 'cookies cleared'})
}

module.exports = { registerStepOne, registerStepTwo, refresh, checkLoginAuth, login, logout, checkLogoutAuth }
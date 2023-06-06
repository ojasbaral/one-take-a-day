const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/auth', auth)

app.listen(5000, () => {
    console.log("[SERVER RUNNING (5000)]")
})

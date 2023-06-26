const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./routes/auth')
const home = require('./routes/home')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/auth', auth)
app.use('/', home)

app.listen(5000, () => {
    console.log("[SERVER RUNNING (5000)]")
})


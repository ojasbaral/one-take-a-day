const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./routes/auth')
const home = require('./routes/home')
const cors = require('cors')

app.use(cors({
    origin: "https://www.onetakeaday.com",
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.method)
    console.log(req._parsedUrl.pathname)
    console.log(req.body)
    console.log(req.params)
    next()
})
app.use('/auth', auth)
app.use('/', home)

app.listen(5000, () => {
    console.log("[SERVER RUNNING (5000)]")
})


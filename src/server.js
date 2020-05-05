const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const apiRouter = require("./routes/api")

const app = express()

mongoose
    .connect('mongodb://localhost:27017/sts_blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connected to mongodb!')
    }).catch((err) => {
        console.log('Error while connecting to database: ' + err.stack)
    })

app.use(express.static(path.join(__dirname, "../public")))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiRouter)

app.use((req, res, next) => {
    res.status(404).json({
        message: `Sorry can't find ${res.originalUrl}!`
    })
})

app.use((err, req, res, next) => {
    res.status(500).json({
        message: `Error: ${err}`
    })
})

module.exports = app
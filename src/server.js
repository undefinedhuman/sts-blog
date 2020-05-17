const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

const apiRouter = require("./routes/api")

const app = express()

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
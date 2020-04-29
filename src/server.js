const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

mongoose
    .connect('mongodb://localhost/sts_blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        err => { throw err },
        () => { console.log('Connected successfully!') }
    )

app.use(express.static(path.join(__dirname, "../public")))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json('Basic get request, response in json!')
})

app.post('/', (req, res) => {
    res.json('Basic post request, response in json!')
})

app.put('/entry', (req, res) => {
    res.json('Basic put request, response in json!')
})

app.delete('/entry', (req, res) => {
    res.json('Basic delete request, response in json!')
})

app.use((req, res, next) => {
    res.status(404).send(`Sorry can't find ${res.originalUrl}!`)
})

app.use((err, req, res, next) => {
    res.status(500).send(`Error: ${err}`);
});

module.exports = app
const express = require("express")
const app = express()

app.get('/', function (req, res) {
    res.json('Basic get request, response in json!')
})

app.post('/', function (req, res) {
    res.json('Basic post request, response in json!')
})

app.put('/put', function (req, res) {
    res.send('Basic put request, response in json!')
})

app.delete('/delete', function (req, res) {
    res.send('Basic delete request, response in json!')
})

module.exports = app
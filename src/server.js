const express = require("express")
const path = require('path')

const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.json('Basic get request, response in json!')
})

app.post('/', function (req, res) {
    res.json('Basic post request, response in json!')
})

app.put('/entry', function (req, res) {
    res.json('Basic put request, response in json!')
})

app.delete('/entry', function (req, res) {
    res.json('Basic delete request, response in json!')
})

module.exports = app
let mongoose = require("mongoose")
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: "Please insert a title"
    },
    body: {
        type: String,
        required: "Please insert a body"
    },
    date: {
        type: Date,
        default: new Date
    }
})

let Article = mongoose.model('article', ArticleSchema)

module.exports = Article
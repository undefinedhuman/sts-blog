let mongoose = require("mongoose")
let Schema = mongoose.Schema

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

let Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
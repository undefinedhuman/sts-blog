const article = require("../article/articleController");
const express = require("express")
const router = express.Router();

router
    .route("/articles/")
    .get(article.getAllArticles)
    .post(article.createArticle)

router
    .route("/articles/:articleID")
    .get(article.getArticleByID)
    .put(article.deleteArticle)
    .delete(article.updateArticle)

module.exports = router;
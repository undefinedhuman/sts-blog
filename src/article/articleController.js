let Article = require('articleModel');

module.exports.createArticle = (req, res) => {
    new Article(req.body).save((err, article) => {
        if (err) res.send(err);
        res.json(article);
    }).then();
};

module.exports.getArticleByID = (req, res) => {
    Article.findById(req.params.articleID, (err, article) => {
        if(err) res.send(err)
        res.json(article);
    });
};

module.exports.getAllArticles = (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) res.send(err);
        res.json(articles);
    });
};

module.exports.updateArticle = (req, res) => {
    Article
        .findOneAndUpdate({ _id: req.params.articleID }, req.body, (err, article) => {
            if (err) res.send(err);
            res.json(article);
        });
};

module.exports.deleteArticle = (req, res) => {
    Article.remove({ _id: req.params.articleID }, (err) => {
        if (err) res.send(err);
        res.json({
            message: `Article (ID: ${req.params.articleID}) deleted successfully!`
        });
    });
};
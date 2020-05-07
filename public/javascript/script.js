class Model {
    constructor() {
        this.articles = []

        httpRequest("GET", "/api/articles/", null, (response) => {
            const parsedResponse = JSON.parse(response);
            for(const i in parsedResponse) {
                if(!parsedResponse.hasOwnProperty(i)) continue
                const article = parsedResponse[i]
                this.pushArticle(article)
            }
            this.updateArticles(this.articles)
        })
    }

    addArticle(articleTitle, articleBody) {
        httpRequest("POST", "/api/articles/",
            "title=" + articleTitle + "&body=" + articleBody,
            (response) => {
            this.pushArticle(JSON.parse(response));
        })
    }

    editArticle(id, newTitle, newBody) {
        httpRequest("PUT", "/api/articles/" + id + "/", "title=" + newTitle + "&body=" + newBody, (response) => {
            const parsedResponse = JSON.parse(response);
            alert(parsedResponse.message)
        })
        this.articles = this.articles.map(article =>
            article.id === id ? { id: article.id, title: newTitle, body: newBody } : article
        )
    }

    deleteArticle(id) {
        httpRequest("DELETE", "/api/articles/" + id + "/", null, (response) => {
            const parsedResponse = JSON.parse(response);
            alert(parsedResponse.message)
        })
        this.articles = this.articles.filter(article => article.id !== id)
    }

    pushArticle(article) {
        const newArticle = {
            id: article._id,
            title: article.title,
            body: article.body,
            read: (article.body.split(" ").length / 200).toFixed(),
            date: new Date(article.created.toString()).toLocaleDateString("en-US", { day: 'numeric', year: 'numeric', month: 'long' })
        }
        this.articles.push(newArticle)
    }

    bindRenderArticles(callback) {
        this.updateArticles = callback
    }

    getArticle(id) {
        return this.articles.filter(article => article.id === id);
    }
}

class View {
    constructor() {
        this.root = this.getElement("#root")
    }

    render(articles) {
        this.clearArticles()

        if(articles.length === 0) {
            const p = this.createElement("p")
            p.textContent = "There aren't any articles in this blog!"
            this.root.append(p)
        } else {
            articles.forEach(article => {
                const articleDiv = this.createElement("div", "article")
                articleDiv.id = article.id

                const articleTitle = this.createElement("h3")
                articleTitle.textContent = article.title
                articleDiv.append(articleTitle)

                const articleInformation = this.createElement("p", "article-information")
                articleInformation.textContent = article.date + " | " + article.read + "min"
                articleDiv.append(articleInformation)

                const articleBody = this.createElement("p", "article-body")
                articleBody.textContent = article.body
                articleDiv.append(articleBody)

                this.root.append(articleDiv)
            })
        }
    }

    createElement(tag, cssClass) {
        const element = document.createElement(tag)
        if (cssClass) element.classList.add(cssClass)
        return element
    }

    getElement(selector) {
        return document.querySelector(selector)
    }

    bindExpandEvent(callback) {
        this.root.addEventListener('click', e => {
            if (e.target.className.startsWith("article")) {
                if(e.target.className.startsWith("article-")) {
                    callback(e.target.parentElement.id)
                } else {
                    callback(e.target.id)
                }
            }
        })
    }

    renderArticle(article) {
        this.clearArticles()
        const articleDiv = this.createElement("div", "article-expand")

        const articleTitle = this.createElement("h3")
        articleTitle.textContent = article.title
        articleDiv.append(articleTitle)

        const articleInformation = this.createElement("p", "article-information")
        articleInformation.textContent = article.date + " | " + article.read + "min"
        articleDiv.append(articleInformation)

        const articleBody = this.createElement("p", "article-body-expand")
        articleBody.textContent = article.body
        articleDiv.append(articleBody)

        this.root.append(articleDiv)
    }

    clearArticles() {
        while (this.root.firstChild)
            this.root.removeChild(this.root.firstChild)
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.model.bindRenderArticles(this.renderArticles)
        this.view.bindExpandEvent(this.handleExpandArticle)
    }

    renderArticles = articles => {
        this.view.render(articles)
    }

    handleExpandArticle = id => {
        const articles = this.model.getArticle(id)
        if (articles.length > 0)
            this.view.renderArticle(articles[0])

    }

}

function httpRequest(method, url, body, callback) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
            callback(httpRequest.responseText);
    }
    httpRequest.send(body);
}

const app = new Controller(new Model(), new View())
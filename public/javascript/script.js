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
        this.articles = this.articles.map(article =>
            article.id === id ? { id: article.id, title: newTitle, body: newBody } : article
        )
    }

    deleteArticle(id) {
        httpRequest("DELETE", "http://localhost:3000/api/articles/" + id + "/", null, (response) => {
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
            date: article.created
        }
        this.articles.push(newArticle)
    }

    renderArticles(callback) {
        this.updateArticles = callback
    }

}

class View {
    constructor() {
        this.root = this.getElement("#root")
    }

    render(articles) {
        while (this.root.firstChild)
            this.root.removeChild(this.root.firstChild)

        if(articles.length === 0) {
            const p = this.createElement("p")
            p.textContent = "There aren't any articles in this blog!"
            this.root.append(p)
        } else {
            articles.forEach(article => {
                const articleDiv = this.createElement("div", "article")

                const articleTitle = this.createElement("h3")
                articleTitle.textContent = article.title
                articleDiv.append(articleTitle)

                const articleInformation = this.createElement("p", "article-information")
                articleInformation.textContent = "6 January 2020 | 6min | STS"
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
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.model.renderArticles(this.render)
    }

    render = articles => {
        this.view.render(articles)
    }
}

function httpRequest(method, url, body, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
            callback(httpRequest.responseText);
    }
    httpRequest.send(body);
}

const app = new Controller(new Model(), new View())
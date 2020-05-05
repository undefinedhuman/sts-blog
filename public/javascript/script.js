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
        this.root = this.getElement('#root')

        this.articlesList = this.createElement('ul')

        this.root.append(this.articlesList)
    }

    render(articles) {
        while (this.articlesList.firstChild)
            this.articlesList.removeChild(this.articlesList.firstChild)

        if(articles.length === 0) {
            const p = this.createElement('p')
            p.textContent = "There aren't any articles in this blog!"
            this.articlesList.append(p)
        } else {
            articles.forEach(article => {
                const li = this.createElement('li')
                li.id = article.id

                const title = this.createElement("h2")
                title.textContent = article.title
                li.append(title)

                this.articlesList.append(li)
            })
        }
    }

    createElement(tag) {
        return document.createElement(tag)
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
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
            callback(httpRequest.responseText);
    }
    httpRequest.send(body);
}

const app = new Controller(new Model(), new View())
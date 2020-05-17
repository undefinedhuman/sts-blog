const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')
const ObjectID = mongoose.Types.ObjectId
const Article = require('./articleModel')

describe("Integration test for article endpoints", () => {

    beforeAll(async () => {
        mongoose.connect('mongodb://localhost:27017/articles_test', { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => { console.log("Connection to test database successful!") })
    })

    it('Test post request', async done => {
        const response = await request.post('/api/articles')
            .send({
                title: 'Test title',
                body: 'Test body'
            })

        const article = await Article.findOne({ title: 'Test title' })
        testArticle(article)

        expect(response.status).toBe(200)
        testArticle(response.body)
        done()
    })

    it('Test get request', async done => {
        await request.post('/api/articles').send({ title: 'Test title', body: 'Test body' })
        const response = await request.get('/api/articles/').send()
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        testArticle(response.body[0])
        done()
    })

    afterEach(async () => {
        await removeAllCollections()
    })

    afterAll(async () => {
        await mongoose.connection
            .close()
            .then(() => {
                console.log("Test database connection closed!")
            })
    })

    function testArticle(response) {
        expect(response._id).toBeTruthy()
        expect(response.title).toBe("Test title")
        expect(response.body).toBe("Test body")
        expect(response.created).toBeTruthy()
    }

    async function removeAllCollections () {
        const collections = Object.keys(mongoose.connection.collections)
        for (const collectionName of collections)
            await mongoose.connection.collections[collectionName].deleteMany()
    }

})
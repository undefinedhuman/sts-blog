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
        const response = await request.post('/api/articles/')
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

    describe("Get Requests", () => {

        beforeEach(async () => {
            for(let i = 0; i < 5; i++) {
                await new Article({
                    _id: new ObjectID("5eb457e491bb49267280eb5" + i),
                    title: "Test title",
                    body: "Test body",
                }).save()
            }
        })

        it('Test get request', async done => {
            const response = await request.get('/api/articles/').send()
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(5)
            for(let i = 0; i < 5; i++)
                testArticle(response.body[i])
            done()
        })

        it('Test get request of article with id', async done => {
            for(let i = 0; i < 5; i++) {
                const response = await request.get(`/api/articles/5eb457e491bb49267280eb5${i}`).send()
                expect(response.status).toBe(200)
                expect(response.body._id).toBe(`5eb457e491bb49267280eb5${i}`)
                testArticle(response.body)
                done()
            }
        })

        afterEach(async () => {
            await removeAllCollections()
        })

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

    function testArticle(article) {
        expect(article._id).toBeTruthy()
        expect(article.title).toBe("Test title")
        expect(article.body).toBe("Test body")
        expect(article.created).toBeTruthy()
    }

    async function removeAllCollections () {
        const collections = Object.keys(mongoose.connection.collections)
        for (const collectionName of collections)
            await mongoose.connection.collections[collectionName].deleteMany()
    }

})
const server = require('./server')
const supertest = require('supertest')
const db = require('../database/dbConfig')

const config = {
    specific: "001-articles 002-categories 003-article_categories"
}

beforeEach(() => {
    return db.migrate.rollback().then(()=>db.migrate.latest()).then(()=>db.seed.run([config]));
});

async function Login(){
    await supertest(server)
    .post("/api/auth/register")
    .send({email: "123@email.com", username:"jesus1", password: "jesus123"})
    const login = await supertest(server)
    .post("/api/auth/login")
    .send({ username:"jesus1", password: "jesus123"})
    const token = await login.body.token
    return token
}


// TESTING

describe('server', () => {
    it('can run the test', () => {
        expect(true).toBeTruthy()
    })

// BASIC ENDPOINT TESTING

    // api is up
    describe('GET /', () => {
        it('should return successful', () => {
            return supertest(server).get("/")
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
        it('should return message', () => {
            return supertest(server).get("/")
            .then(res => {
                expect(res.body).toEqual({ message:"Hello, your API is up!" })
            })
        })
    })

// USER ROUTES ENDPOINT TESTING

    // register
    describe('POST / register', () => {
        it('should return successful', () => {
            return supertest(server)
            .post("/api/auth/register")
            .send({email: "123@email.com", username:"jesus1", password: "jesus123"})
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body.data).toEqual({ id:1 , username: "jesus1"})
                })
        })
        it('should return unsuccesful', () => {
            return supertest(server)
            .post("/api/auth/register")
            .send({email: 1, username: 1, password: 2})
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toEqual({ message: "please provide valid credentials" })
                })
        })
    })

    // Login
    describe('POST / login', () => {
        it('should return successful', async () => {
            await supertest(server)
            .post("/api/auth/register")
            .send({email: "123@email.com", username:"jesus1", password: "jesus123"})
            const res = await supertest(server)
            .post("/api/auth/login")
            .send({ username:"jesus1", password: "jesus123"})
            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })
        it('should return unsuccessful', async () => {
            const res = await supertest(server)
            .post("/api/auth/login")
            .send({ username:"jesus2", password: "jesus1234"})
            expect(res.status).toBe(401)
            expect(res.body).toMatchObject({ message: "username or password does not match." })
        })
    })

    // delete
    describe('DELETE / user', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .delete("/api/users/1")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ message: "user deleted" })
        })
        it('should return unsuccessful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .delete("/api/users/2")
            .set('authorization', token)
            expect(res.status).toBe(404)
            expect(res.body).toMatchObject({ message:"user not found" })
        })
    })

// ARTICLES ENDPOINTS

    // Get all articles
    describe('GET / articles', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/articles")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body.data)).toBe(true)
        })
        it('should return cannot pass if restricted', async () => {
            const res = await supertest(server)
            .get("/api/articles")
            expect(res.status).toBe(401)
            expect(res.body).toMatchObject({ message: "authentication error, cannot pass" })
        })
    })

    // get an individual article
    describe('GET / article by id', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/articles/1")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(res.body.data.name).toBe("What is Lorem Ipsum?")
        })
        it('should return unsuccessful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/articles/50")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({})
        })
    })

    // post an individual article
    describe('POST / article by id', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .post("/api/articles")
            .send({ name:"yoyo", article:"wassup" })
            .set('authorization', token)
            expect(res.status).toBe(201)
            expect(res.body.data).toMatchObject({ article: "wassup", id: 4, isSaved: 0, name: "yoyo" })
        })
        it('should return unsuccessful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .post("/api/articles")
            .send({ article:"wassup" })
            .set('authorization', token)
            expect(res.status).toBe(400)
            expect(res.body).toMatchObject({ message: "please provide name and article" })
        })
    })

    // get an article by categories
    describe('GET / article by categories', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/articles/1/categories")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(res.body.data).toMatchObject([{"Category": "Technology", "article": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "id": 1, "isSaved": 0, "name": "What is Lorem Ipsum?"}])
        })
        it('should return unsuccessful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .post("/api/articles")
            .send({ article:"wassup" })
            .set('authorization', token)
            expect(res.status).toBe(400)
            expect(res.body).toMatchObject({ message: "please provide name and article" })
        })
    })

    // add an article by categories
    describe('POST / article by categories', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .post("/api/articles/1/categories")
            .send({name: "Art"})
            .set('authorization', token)
            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({ message: "Category added to article!" })
        })
        it('should return unsuccessful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .post("/api/articles/1/categories")
            .send({name: ''})
            .set('authorization', token)
            expect(res.status).toBe(400)
            expect(res.body).toMatchObject({ message: "please provide a valid category" })
        })
    })

// CATEGORY ENDPOINTS

    // get categories
    describe('GET / Categories', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/categories")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body.data)).toBeTruthy()
        })
        it('should return unauthorized', async () => {
            const res = await supertest(server)
            .get("/api/categories")
            expect(res.status).toBe(401)
            expect(res.body).toMatchObject({ message: "authentication error, cannot pass"})
        })
    })

    // post categories
    describe('POST / Categories', () => {
        it('should return successful', async () => {
            const token = await Login()
            const res = await supertest(server)
            .get("/api/categories")
            .set('authorization', token)
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body.data)).toBeTruthy()
        })
        it('should return unauthorized', async () => {
            const res = await supertest(server)
            .get("/api/categories")
            expect(res.status).toBe(401)
            expect(res.body).toMatchObject({ message: "authentication error, cannot pass"})
        })
    })
})



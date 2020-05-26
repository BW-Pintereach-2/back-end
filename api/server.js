const express = require('express')
const helmet = require('helmet')

const articleRouter = require('../articles/articleRouter')
const authRouter = require('../auth/authRouter')
const authenticate = require('../auth/authenticate-middleware')
const server = express()

server.use(helmet())
server.use(express.json())

server.use('/api/auth', authRouter)
server.use('/api/articles', authenticate, articleRouter)

server.get("/", (req, res) => {
    res.status(200).json({message:"Hello, your API is up!"})
})

module.exports = server
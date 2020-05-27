const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const articleRouter = require('../articles/articleRouter')
const authRouter = require('../auth/authRouter')
const categoriesRouter = require('../categories/categoriesRouter')
const userRouter = require('../users/userRouter')
const authenticate = require('../auth/authenticate-middleware')
const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/auth', authRouter)
server.use('/api/articles', authenticate, articleRouter)
server.use('/api/categories', authenticate, categoriesRouter)
server.use('/api/users', authenticate, userRouter)


server.get("/", (req, res) => {
    res.status(200).json({message:"Hello, your API is up!"})
})

module.exports = server
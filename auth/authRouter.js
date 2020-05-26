const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = require('express').Router()

const User = require('./userModel')
const { isUserWithEmailValid, isUserValid } = require('../validation/validate') 

router.post('/register', (req, res) => {
    const credentials = req.body

    if (isUserWithEmailValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8
        const hash = bcryptjs.hashSync(credentials.password, rounds)

        credentials.password = hash

        User.insert(credentials)
        .then(([id]) => {
            User.findById(id).then(({id, username}) => {
                res.status(201).json({ data: {id, username}})
            })
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" })
        })
    } else {
        res.status(400).json({
            message: "please provide valid credentials",
        })
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    if(isUserValid(req.body)){
        User.findBy({ username:username })
        .then(([user]) => {
            if (user && bcryptjs.compareSync(password, user.password)){
                const token = createToken(user)

                res.status(200).json({ token:token })
            } else {
                res.status(401).json({ message:"username or password does not match."})
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error"})
        })
    } else {
        res.status(400).json({ message: "please provide a valid username and password" })
    }
})

const jwtSecret = process.env.JWT_SECRET || "keepitsecret"

function createToken(user){
    const payload = {
        sub:user.id,
        username: user.username
    }

    const options = {
        expiresIn: '1d'
    }

     return jwt.sign(payload, jwtSecret, options)
}

// .then(res => {
//     res.status(200).json({ data:res })
// })
// .catch(error => {
//     res.status(500).json({ message: "Internal Server Error" })
// })


module.exports = router
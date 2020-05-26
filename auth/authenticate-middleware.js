const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
const token = req.headers.authorization

    if(token){
        const secret = process.env.JWT_SECRET || "keepitsecret"

        jwt.verify(token, secret, (error, decodedToken) => {
            if(error){
                res.status(401).json({ message:"authentication error, cannot pass"})
            } else {
                req.jwt = decodedToken
                next()
            }
        })
    } else {
        res.status(401).json({ message:"authentication error, cannot pass"})
    }
}
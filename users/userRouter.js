const router = require('express').Router()

const User = require('./userModel')

router.delete('/:id', (req, res) => {
    const id = req.params.id

    User.remove(id).then(obj => {
        if(obj === 0 || obj === false){
            res.status(404).json({ message:"user not found" })
        } else {
            res.status(200).json({ message: "user deleted" })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    })
})

module.exports = router
const router = require('express').Router()
const Articles = require('./articleModel')

const { isArticleValid } = require('../validation/validate')

router.get('/', (req, res) => {
    Articles.find()
    .then(articles => {
        res.status(200).json({ data:articles })
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" })
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    Articles.findById(id)
    .then(article => {
        res.status(200).json({ data: article })
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" })
    })
})

router.post('/', (req, res) => {
    const article = req.body

    if(isArticleValid(article)){
        Articles.insert(article)
        .then(([id]) => {
            return Articles.findById(id).then(article => {
                return res.status(201).json({ data: article })
            })
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" })
        })    
    } else {
        res.status(400).json({ message: "please provide name and article" })
    }
})

// router.post('/:id/categories', (req, res) => {
//     const article = req.body

//     if(isArticleValid(article)){
//         Articles.insert(article)
//         .then(([id]) => {
//             return Articles.findById(id).then(article => {
//                 return res.status(200).json({ data:article })
//             })
//         })
//         .catch(error => {
//             res.status(500).json({ message: "Internal Server Error" })
//         })    
//     } else {
//         res.status(400).json({ message: "please provide name and article" })
//     }
// })

// .then(res => {
//     res.status(200).json({ data:res })
// })
// .catch(error => {
//     res.status(500).json({ message: "Internal Server Error" })
// })

module.exports = router
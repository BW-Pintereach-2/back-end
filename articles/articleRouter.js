const router = require('express').Router()
const Articles = require('./articleModel')
const Categories = require('../categories/categoriesModel')

const { isArticleValid, isCategoryValid } = require('../validation/validate')

//articles

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

router.patch('/:id', (req, res) => {
    const id  = req.params.id
    const { isSaved } = req.body

    console.log(isSaved , id)
    Articles.update(isSaved, id).then(() => {
        res.status(200).json({ message: "updated" })
    })
    .catch(() => {
        res.status(500).json({ message: "Internal Server Error" })
    })
})

// categories

router.get('/:id/categories', (req, res) => {
    const id = req.params.id

    Categories.findArticleWithCategory(id)
    .then(article => {
        if(article.length > 0){
            res.status(200).json({ data: article })
        } else {
            res.status(400).json({ message:"this article has no categories" })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    })
})

router.post('/:id/categories', (req, res) => {
    const id = req.params.id
    const { name } = req.body

    if(isCategoryValid(req.body)){
        Categories.insertCategory(name, id)
        .then(() => {
            res.status(201).json({ message:"Category added to article!" })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" })
        })
    } else {
        res.status(400).json({ message:"please provide a valid category" })
    }
})

module.exports = router
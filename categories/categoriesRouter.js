const router = require('express').Router()
const Categories = require('./categoriesModel')

const { isCategoryValid } = require('../validation/validate')

router.get('/', (req, res) => {
    Categories.findCategories()
    .then(categories => {
        res.status(200).json({ data: categories})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    })
})

router.post('/', (req, res) => {
    const category = req.body

    if(isCategoryValid(category)){
        Categories.insertNewCategory(category)
        .then(([id]) => {
            Categories.findByCategoryId(id).then(category => {
                res.status(201).json({ data:category })
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" })
        })
    } else {
        res.status(400).json({ message: "please provide a valid category" })
    }
})
module.exports = router
const db = require('../database/dbConfig')

module.exports = {
    find,
    insert,
    findById,
}

function find(){
    return db('Articles')
}

function insert(article){
    console.log(article)
    return db('Articles').insert(article, "id")
}

function findById(id){
    return db("Articles").where({ id }).first()
}
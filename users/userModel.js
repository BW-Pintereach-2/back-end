const db = require('../database/dbConfig')

module.exports = {
    remove
}

function remove(id){
    return db('users').where({ id }).del()
}
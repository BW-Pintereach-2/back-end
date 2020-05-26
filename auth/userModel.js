const db = require('../database/dbConfig')

module.exports = {
    insert,
    findBy,
    findById,
}

function insert(user){
    return db("Users").insert(user, "id")
 }
 
 function findBy(filter){
     return db("Users").where(filter).orderBy("id")
 }
 
 function findById(id){
     return db("Users").where({ id }).first()
 }
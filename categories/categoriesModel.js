const db = require('../database/dbConfig')

module.exports = {
    findArticleWithCategory,
    findCategories,
    insertCategory,
    findByCategory,
    findByCategoryId,
    insertNewCategory
}

function findArticleWithCategory(id){
    return db("Article_Category as AC")
    .select(
        'A.id',
        'C.name as Category',
        'A.name as name',
        'article',
        'isSaved'
    )
    .join("Articles as A", "A.id", "AC.article_id")
    .join("Categories as C", "C.id", "AC.category_id")
    .where("A.id", "=", `${id}`)
}

function findCategories(){
    return db("Categories").select(
        'name'
    )
}

function findByCategory(category){
    return db("Categories").where('name', '=', `${category}`).first()
}

function findByCategoryId(id){
    return db("Categories").where({ id }).select(
        'name'
    ).first()
}

function insertCategory(category, id){
    return findByCategory(category)
    .then(res => {
        console.log(res)
        return db("Article_Category as AC")
        .select(
            'A.id',
            'C.name as Category',
            'A.name as name',
            'article',
            'isSaved'
        )
        .join("Articles as A", "A.id", "AC.article_id")
        .join("Categories as C", "C.id", "AC.category_id")
        .where("A.id", "=", `${id}`)
        .insert({article_id:id, category_id:res.id})
    })
}

function insertNewCategory(category){
    return db('Categories').insert(category, "id")
}
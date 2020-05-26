
module.exports = {
    isUserWithEmailValid,
    isUserValid,
    isArticleValid,
}

function isUserValid(user){
    return Boolean(user.username && user.password && typeof user.password === "string")
}

function isUserWithEmailValid(user){
    return Boolean(user.username && user.password && user.email && typeof user.password === "string")
}

function isArticleValid(article){
    return Boolean(article.name && article.article)
}
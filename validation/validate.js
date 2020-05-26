
module.exports = {
    isUserWithEmailValid,
    isUserValid,
}

function isUserValid(user){
    return Boolean(user.username && user.password && typeof user.password === "string")
}

function isUserWithEmailValid(user){
    return Boolean(user.username && user.password && user.email && typeof user.password === "string")
}
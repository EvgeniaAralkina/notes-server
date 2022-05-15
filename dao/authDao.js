const db = require('../db')

module.exports.getUser = function(login) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем пользователя по логину!")
        const user = await db.query('select * from users where login = $1;', [login])
        resolve(user)
    })
}

module.exports.getUserName = function(user_id) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем пользователя по логину!")
        const user = await db.query('select * from users where user_id = $1;', [user_id])
        resolve(user)
    })
}

module.exports.addUser = function(login, pswrd) {
    return new Promise(async (resolve, reject) => {
        console.log("добавляем нового пользователя!")
        const newUser =
            await db.query('INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *', [login, pswrd])
        resolve(newUser.rows);
    })
}

module.exports.addToken = function(user_id, token) {
    return new Promise(async (resolve, reject) => {
        console.log("добавляем токен")
        const newUser =
            await db.query('INSERT INTO token (user_id, token) VALUES ($1, $2) RETURNING *', [user_id, token])
        resolve(newUser.rows);
    })
}

module.exports.getToken = function(t) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем токен")
        const token = await db.query('select * from token where token = $1;', [t])
        resolve(token.rows);
    })
}

module.exports.deleteToken = function(user_id) {
    return new Promise(async (resolve, reject) => {
        console.log("удаляем старые записи об авторизации")
        const token = await db.query('delete from token where user_id = $1;', [user_id])
        resolve(token.rows);
    })
}


module.exports.deleteTokenByToken = function(t) {
    return new Promise(async (resolve, reject) => {
        console.log("удаляем старые записи об авторизации")
        const token = await db.query('delete from token where token = $1;', [t])
        resolve(token.rows);
    })
}

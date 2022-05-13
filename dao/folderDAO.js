const db = require('../db')

module.exports.getFolder = function(user_id) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем все папки!")
        const folders = await db.query('select * from folders where user_id = $1;', [user_id])
        resolve(folders.rows)
    })
}

module.exports.getOneFolder = function(user_id, folder_name) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем папк по имени!")
        const folders = await db.query(
            'select * from folders where user_id = $1 and folder_name=$2;',
            [user_id, folder_name])
        resolve(folders.rows)
    })
}

module.exports.addFolder = function(user_id, folder_name) {
    return new Promise(async (resolve, reject) => {
        console.log("добавляем папку!")
        const newFolder =
            await db.query
            ('INSERT INTO folders (user_id, folder_name) VALUES ($1, $2) RETURNING *',
                [user_id, folder_name])
        resolve(newFolder.rows);
    })
}

module.exports.deleteFolder = function(folder_id) {
    return new Promise(async (resolve, reject) => {
        console.log("удаляем папку!")
        const deleteNotes = db.query('DELETE FROM notes WHERE folder_id = $1', [folder_id])
        const deleteFolder =
            await db.query
            ('DELETE FROM folders WHERE folder_id = $1',
                [folder_id])
        resolve(deleteFolder.rows);
    })
}
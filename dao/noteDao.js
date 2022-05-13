const db = require('../db')

module.exports.getNote = function(user_id) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем все заметки!")
        const notes = await db.query('select * from notes where user_id = $1;', [user_id])
        resolve(notes.rows)
    })
}

module.exports.addNote = function(user_id, content, folder_id) {
    return new Promise(async (resolve, reject) => {
        console.log("добавляем заметку!")
        const newNote =
            await db.query
            ('INSERT INTO notes (user_id, content, folder_id) VALUES ($1, $2, $3) RETURNING *',
                [user_id, content, folder_id])
        resolve(newNote.rows);
    })
}

module.exports.deleteNote = function(note_id) {
    return new Promise(async (resolve, reject) => {
        console.log("удаляем заметку!")
        const deleteNote =
            await db.query
            ('DELETE FROM notes WHERE note_id = $1',
                [note_id])
        resolve(deleteNote.rows);
    })
}

module.exports.getNotesFromFolder = function(user_id, folder_id) {
    return new Promise(async (resolve, reject) => {
        console.log("ищем все заметки в папке!")
        const notes = await db.query(
            'select * from notes where user_id = $1 and folder_id = $2;',
            [user_id, folder_id]
        )
        resolve(notes.rows)
    })
}
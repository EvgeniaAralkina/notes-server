const folderDAO = require("../dao/folderDAO");
const noteDAO = require("../dao/noteDao");

module.exports.folders = function (user_id){
    return new Promise((resolve, reject) => {
        resolve(folderDAO.getFolder(user_id)
            .then( result => {
                return(result)
            })
        )
    })
}

module.exports.notes = function (user_id){
    return new Promise((resolve, reject) => {
        resolve(noteDAO.getNote(user_id)
            .then(result => {
                return(result)
            })
        )
    })
}

module.exports.notesInFolder = function (user_id, folder_id){
    return new Promise((resolve, reject) => {
        console.log(folder_id)
        console.log(user_id)
        resolve(noteDAO.getNotesFromFolder(user_id, folder_id)
            .then(result => {
                console.log("-->", result)
                return(result)
            })
        )
    })
}
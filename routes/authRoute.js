const AuthRoute = require('express')
const route = new AuthRoute();
const authDAO = require('../dao/authDao')
const noteDAO = require('../dao/noteDao')
const folderDAO = require('../dao/folderDAO')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require("../db");
const noteAndFolderService = require("../services/noteAndFolderService")

// проверка авторизации
let auth2 = function(token) {
    return new Promise((resolve, reject) => {
        console.log("проверяем токен версия 2.0!")
        resolve(authDAO.getToken(token).then(
            result => {
                console.log("токен->", result)
                return(result)
            }
        )
        )
    })
}

const isValidPassword = function(pass, hash) {
    return bcrypt.compareSync(''+pass, hash);
}

route.post('/registration', (req, res, next)=>{
    const{login, password} = req.body
        authDAO.getUser(login)
            .then((results)=>{
                if (results.rowCount == 0){
                    authDAO
                        .addUser(
                            login,
                            bcrypt.hashSync(''+password, 10)
                        )
                        .then((results)=>{
                            res.json({
                                message: 'Пользователь добавлен: ' + results[0],
                                answ: "ok"
                            })
                        })
                        .catch((err)=>{
                            next(err);
                        })
                } else {

                    console.log("user exist")
                    res.json({
                        answ: "user exist"
                    })
                }
            })
            .catch((err)=>{
                next(err);
            })
})

route.post('/login', (req, res, next)=>{
    const{login, password} = req.body
    authDAO.getUser(login)
        .then((results)=>{
            if (isValidPassword(password, results.rows[0].password)) {
                let user_id = results.rows[0].user_id;
                authDAO.deleteToken(user_id)
                    .then((results)=>{
                        authDAO.addToken(user_id, uuidv4())
                            .then((results)=>{
                                res.json({
                                    token: results[0].token
                                })
                            })
                            .catch((err)=>{
                                next(err)
                            })
                    })
                    .catch((err)=>{
                        next(err)
                    })
            } else {
                res.json({
                    answ: "err login"
                })
            }
        })
        .catch((err)=>{
            next(err);
        })
})

route.post('/logout', (req,res) => {
    console.log("logout")
    const token = req.headers.authorization
    authDAO.deleteTokenByToken(token).then(r =>{
        res.json({})
    })
});

route.get('/getNotesAndFolders', (req, res) => {
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({ answ: "no login"})
        } else {
            console.log(result)
            user_id = result[0]['user_id']
            console.log("get all ")
                    noteAndFolderService.folders(user_id).then(
                        result => {
                            let folder = result
                            noteAndFolderService.notes(user_id).then(
                                result => {
                                    let note = result
                                    authDAO.getUserName(user_id).then(
                                        result => {
                                            res.json({
                                                folder: folder,
                                                note: note,
                                                login: result.rows[0]['login'],
                                                answ:"ok"
                                            })
                                })
                                })

                        })
        }})
})

route.get('/:id/getNotesAndFolders', (req, res) => {
    console.log("get all in folder")
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({ answ: "no login"})
        } else {
            user_id = result[0]['user_id']
            let folder_id = req.params['id']
            noteAndFolderService.folders(user_id)
                .then( result => {
                    let folder = result
                    noteAndFolderService.notesInFolder(user_id, folder_id)
                        .then( result => {

                            res.json({
                                folder: folder,
                                note: result,
                                answ:"ok"
                            })
                        })
                })
        }})
})

route.post('/addNote', (req,res) => {
    console.log("add new note")
    const {content, folder} = req.body
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({answ: "no login"})
        } else {
            user_id = result[0]['user_id']
            noteDAO.addNote(user_id, content, folder)
                .then(result => {
                    res.json({answ: "ok"})
                })
        }
    })
});

route.delete('/deleteNote', (req,res) => {
    console.log("delete note")
    const {note_id} = req.body
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({answ: "no login"})
        } else {
            user_id = result[0]['user_id']
            noteDAO.deleteNote(note_id)
                .then(result =>{
                    res.json({answ: "ok"})})}})
});

route.delete('/deleteFolder', (req,res) => {
    console.log("delete folder")
    const {folder_id} = req.body
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({answ: "no login"})
        } else {
            user_id = result[0]['user_id']
            folderDAO.deleteFolder(folder_id)
                .then(result => {
                    res.json({answ: "ok"})
                })
        }
    })});

route.post('/addFolder', (req,res) => {
    console.log("add new note")
    const {folder_name} = req.body
    auth2(req.headers.authorization).then(result => {
        if (result.length === 0) {
            res.json({answ: "no login"})
        } else {
            user_id = result[0]['user_id']
            folderDAO.addFolder(user_id, folder_name)
                .then(result => {
                    res.json({
                        answ: "ok"
                    })
                })
        }
    })
});

module.exports = route;
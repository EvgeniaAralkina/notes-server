const AuthRoute = require('express')
const route = new AuthRoute();
const authDAO = require('../dao/authDao')
const noteDAO = require('../dao/noteDao')
const folderDAO = require('../dao/folderDao')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require("../db");


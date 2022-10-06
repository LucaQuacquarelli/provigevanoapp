const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const Config = require('./Config')
var sequelize = Config.sequelize()
var Model = require('../business-logic/models/index')(sequelize.pro())

const LanguagesController = require('./controllers/LanguagesController')
const RolesController = require('./controllers/RolesController')
const LevelsController = require('./controllers/LevelsController')
const PlayersController = require('./controllers/PlayersController')

const { body, check } = require('express-validator')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/languages', LanguagesController.index)
app.get('/roles', RolesController.index)
app.get('/levels', LevelsController.index)
app.get('/players', PlayersController.index)

module.exports = app
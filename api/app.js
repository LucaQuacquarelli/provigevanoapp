const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('../config.json')
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
// app.post('/update_player',
//     body('name').not().isEmpty().trim().escape(),
//     body('surname').not().isEmpty().trim().escape(),
//     body('nick_name').not().isEmpty().trim().escape(),
//     [check('date-of-birth').isISO8601().toDate()],
//     [check("language_id", "language not supported").isIn(config.app_lang_supported)],
// PlayersController.update)
app.get('/update_player', PlayersController.update)

module.exports = app
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('../config.json')
const Config = require('./Config')
const sequelize = Config.sequelize()
const ModelBase = require(`${__dirname}/models/ModelBase`)(sequelize.pro())

const LanguagesController = require('./controllers/LanguagesController')
const RolesController = require('./controllers/RolesController')
const LevelsController = require('./controllers/LevelsController')
const PlayersController = require('./controllers/PlayersController')

const { body, check } = require('express-validator')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 ** Players CRUD
 */
app.get('/players', PlayersController.index)
app.post('/player/update',
  body('name').not().isEmpty().trim().escape(),
  body('surname').not().isEmpty().trim().escape(),
  body('nick_name').not().isEmpty().trim().escape(),
  // [check('date-of-birth').isISO8601().toDate()],
  // [check("language_id", "language not supported").isIn(config.app_lang_supported)],
  PlayersController.update)

/**
 ** Players endPoints
 */
app.post('/players/search', PlayersController.searchPlayers)
app.get('/players/get_by_level', PlayersController.getByLevel)
app.get('/players/available_unavailable', PlayersController.available_unavailable)
app.post('/players_availability', PlayersController.setAvailability)
app.get('/players_availability/clear', PlayersController.clearAvailability)
app.post('/goalkeeper_provisory', PlayersController.setGoalKeepersProvisory)
app.get('/goalkeeper_provisory/clear', PlayersController.clearGoalKeepersProvisory)

/**
 ** Levels
 */
app.get('/levels', LevelsController.index)

/**
 **Languages
 */
app.get('/languages', LanguagesController.index)

/**
 **Roles
 */
app.get('/roles', RolesController.index)

module.exports = app

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Config = require('./Config');
var sequelize = Config.sequelize();
var Model = require('../business-logic/models/index')(sequelize.pro());

const LanguagesController = require('./controllers/LanguagesController');
const RolesController = require('./controllers/RolesController');

const { body, check } = require('express-validator');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/languages', LanguagesController);
app.get('/roles', RolesController);

module.exports = app;
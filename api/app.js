/*
 * Author: Luca QUACQUARELLI
 *
 * Created on Mon Jul 11 2022
 *
 * Copyright (c) 2022 Conduent Business Solutions Italia SPA
 *
 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const LanguagesController = require('./controllers/LanguagesController')

const { body, check } = require('express-validator')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/languages', LanguagesController)

module.exports = app
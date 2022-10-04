/*
 * Author: Luca QUACQUARELLI
 *
 * Created on Mon Jul 11 2022
 *
 * Copyright (c) 2022 Conduent Business Solutions Italia SPA
 *
 */

const Config = require('../Config')
var sequelize = Config.sequelize()

module.exports = (req, res) => {
    var Model = require('../../business-logic/models/index')(sequelize.pro())
    Model.Language.findAll().then((language) => {
        res.send(language)
    })
}
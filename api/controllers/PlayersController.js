const Config = require('../Config')
var sequelize = Config.sequelize()
const { validationResult } = require('express-validator')
var Model = require('../../business-logic/models/index')(sequelize.pro())

module.exports.index = (req, res) => {
    Model.Player.findAll().then((player) => {
        res.send(player)
    })
}

module.exports.update = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.send({
            errors: errors.errors
        })
    } else {
        Model.Player.findAll({
            attributes: ['id']
        })
        .then((player) => {
            res.send(player)
        })
    }
}
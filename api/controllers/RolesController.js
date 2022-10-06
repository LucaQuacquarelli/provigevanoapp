const Config = require('../Config')
var sequelize = Config.sequelize()

module.exports.index = (req, res) => {
    var Model = require('../../business-logic/models/index')(sequelize.pro())
    Model.Role.findAll().then((roles) => {
        res.send(roles)
    })
}
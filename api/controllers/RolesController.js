const Config = require('../Config')
var sequelize = Config.sequelize()

module.exports = (req, res) => {
    var Model = require('../../business-logic/models/index')(sequelize.pro())
    Model.Role.findAll().then((role) => {
        res.send(role)
    })
}
const Config = require('../Config')
var sequelize = Config.sequelize()

module.exports.index = (req, res) => {
    var Model = require('../../business-logic/models/index')(sequelize.pro())
    Model.Language.findAll().then((language) => {
        res.send(language)
    })
}
const Config = require('../Config')
var sequelize = Config.sequelize()

module.exports.index = (req, res) => {
    var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())
    ModelBase.Language.findAll().then((language) => {
        res.send(language)
    })
}
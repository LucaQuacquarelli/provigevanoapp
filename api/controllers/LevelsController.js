const Config = require('../Config')
var sequelize = Config.sequelize()
var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())

module.exports.index = (req, res) => {
    ModelBase.Level.findAll().then((levels) => {
        res.send(levels)
    })
}
const Config = require('../Config')
const sequelize = Config.sequelize()
const ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())

module.exports.index = (req, res) => {
  ModelBase.Level.findAll().then((levels) => {
    res.send(levels)
  })
}

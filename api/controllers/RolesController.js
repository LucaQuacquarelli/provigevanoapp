const Config = require('../Config')
const sequelize = Config.sequelize()

module.exports.index = (req, res) => {
  const ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())
  ModelBase.Role.findAll().then((roles) => {
    res.send(roles)
  })
}

const Config = require('../Config')
const sequelize = Config.sequelize()

module.exports.index = (req, res) => {
  const ModelBase = require(path.join(__dirname, '../models/ModelBase'))(sequelize.pro())
  ModelBase.Language.findAll().then((language) => {
    res.send(language)
  })
}

const Sequelize = require('sequelize')
const config = require('../config.json')

module.exports.sequelize = () => {
  let oMTPSequelize
  return {
    pro: () => {
      if (oMTPSequelize === undefined) {
        const database = config.dbms.database
        oMTPSequelize = new Sequelize(config.dbms)
        oMTPSequelize.dialect.supports.schemas = true
        config.dbms.database = database
      }
      return oMTPSequelize
    }
  }
}

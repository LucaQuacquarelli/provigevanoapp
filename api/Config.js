const Sequelize = require('sequelize')
const config = require('../config.json')

module.exports.sequelize = () => {
    var oMTPSequelize
    return {
        pro: () => {
            if (oMTPSequelize === undefined) {
                var database = config.dbms.database
                oMTPSequelize = new Sequelize(config.dbms)
                oMTPSequelize.dialect.supports.schemas = true
                config.dbms.database = database
            }
            return oMTPSequelize
        }
    }
}
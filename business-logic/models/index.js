module.exports = (sequelize) => {
    var models = {
        Player: require('./Player')(sequelize),
        Language: require('./Language')(sequelize),
        Role: require('./Role')(sequelize)
    }
    return models
}
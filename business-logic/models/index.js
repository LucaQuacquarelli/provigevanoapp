module.exports = (sequelize) => {
    var models = {
        Player: require('./Player')(sequelize),
        Language: require('./Language')(sequelize),
        Role: require('./Role')(sequelize),
        Level: require('./Level')(sequelize)
    }
    sequelize.sync({ alter: true });
    return models
}   
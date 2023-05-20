module.exports = (sequelize) => {
  const models = {
    Player: require('./Player')(sequelize),
    Language: require('./Language')(sequelize),
    Role: require('./Role')(sequelize),
    Level: require('./Level')(sequelize)
  }

  models.Level.hasMany(models.Player, { foreignKey: 'level_id' })
  models.Player.belongsTo(models.Level, { foreignKey: 'level_id' })
  models.Language.hasMany(models.Player, { foreignKey: 'language_id' })
  models.Player.belongsTo(models.Language, { foreignKey: 'language_id' })
  models.Role.hasMany(models.Player, { foreignKey: 'role_id' })
  models.Player.belongsTo(models.Role, { foreignKey: 'role_id' })
  return models
}

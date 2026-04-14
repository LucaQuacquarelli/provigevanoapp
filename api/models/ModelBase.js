module.exports = (sequelize) => {
  const models = {
    Player: require('./Player')(sequelize),
    Language: require('./Language')(sequelize),
    Role: require('./Role')(sequelize),
    Level: require('./Level')(sequelize),
    PlayerRole: require('./PlayerRole')(sequelize)
  }

  models.Level.hasMany(models.Player, { foreignKey: 'level_id' })
  models.Player.belongsTo(models.Level, { foreignKey: 'level_id' })
  models.Language.hasMany(models.Player, { foreignKey: 'language_id' })
  models.Player.belongsTo(models.Language, { foreignKey: 'language_id' })
  models.Role.hasMany(models.Player, { foreignKey: 'role_id' })
  models.Player.belongsTo(models.Role, { foreignKey: 'role_id' })

  // Multi-role (tactical roles): many-to-many via player_roles junction table
  models.Player.belongsToMany(models.Role, {
    through: models.PlayerRole,
    foreignKey: 'player_id',
    otherKey: 'role_id',
    as: 'roles'
  })
  models.Role.belongsToMany(models.Player, {
    through: models.PlayerRole,
    foreignKey: 'role_id',
    otherKey: 'player_id',
    as: 'players_multi'
  })

  return models
}

const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = Sequelize.Model

  class PlayerRole extends Model {}

  PlayerRole.init({
    player_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    role_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'player_role',
    tableName: 'player_roles',
    createdAt: false,
    updatedAt: false
  })

  return PlayerRole
}

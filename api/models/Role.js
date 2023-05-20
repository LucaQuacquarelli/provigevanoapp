const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = Sequelize.Model

  class Role extends Model {};

  Role.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: Sequelize.CHAR(20),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'role',
    createdAt: false,
    updatedAt: false
  })

  return Role
}

const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = Sequelize.Model

  class Level extends Model {};

  Level.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: Sequelize.CHAR(20),
      allowNull: false
    },
    percentage: {
      type: Sequelize.TINYINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'level',
    createdAt: false,
    updatedAt: false
  })

  return Level
}

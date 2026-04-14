'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new tactical roles
    await queryInterface.bulkInsert('roles', [
      { id: 3, name: 'difensore' },
      { id: 4, name: 'centrocampo' },
      { id: 5, name: 'attaccante' }
    ])

    // Create player_roles junction table
    await queryInterface.createTable('player_roles', {
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'players', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('player_roles')
    await queryInterface.bulkDelete('roles', { id: [3, 4, 5] })
  }
}

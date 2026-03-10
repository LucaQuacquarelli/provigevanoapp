'use strict'

/** @type {import('sequelize-cli').Migration} */
const newPlayers = require('../dataToSeed/add_new_players.json')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // Get the maximum ID from the players table
    const [results] = await queryInterface.sequelize.query(
      'SELECT COALESCE(MAX(id), 0) as maxId FROM players'
    )
    let nextId = results[0].maxId + 1
    
    // Get existing nick_names to avoid duplicates
    const [existingPlayers] = await queryInterface.sequelize.query(
      'SELECT nick_name FROM players'
    )
    const existingNickNames = new Set(existingPlayers.map(p => p.nick_name))
    
    // Filter out players with existing nick_names
    const newPlayersToInsert = newPlayers.players.filter(
      player => !existingNickNames.has(player.nick_name)
    )
    
    const playersWithIds = newPlayersToInsert.map(player => ({
      ...player,
      id: nextId++
    }))
    
    if (playersWithIds.length > 0) {
      await queryInterface.bulkInsert('players', playersWithIds, {})
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const nickNames = newPlayers.players.map(p => p.nick_name)
    await queryInterface.bulkDelete('players', {
      nick_name: {
        [Sequelize.Op.in]: nickNames
      }
    }, {})
  }
}

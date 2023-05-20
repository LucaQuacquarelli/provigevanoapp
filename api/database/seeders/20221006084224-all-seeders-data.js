'use strict'

/** @type {import('sequelize-cli').Migration} */
const allData = require(`${__dirname}/../dataToSeed/allSeeders.json`)
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
    await queryInterface.bulkInsert('roles', allData.roles, {})
    await queryInterface.bulkInsert('languages', allData.languages, {})
    await queryInterface.bulkInsert('levels', allData.levels, {})
    await queryInterface.bulkInsert('players', allData.players, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {})
    await queryInterface.bulkDelete('Languages', null, {})
    await queryInterface.bulkDelete('Levels', null, {})
    await queryInterface.bulkDelete('Players', null, {})
  }
}

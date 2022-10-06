'use strict';

/** @type {import('sequelize-cli').Migration} */
const allData = require("../dataToSeed/allSeeders.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Roles', allData.roles, {});
    await queryInterface.bulkInsert('Languages', allData.languages, {});
    await queryInterface.bulkInsert('Levels', allData.levels, {});
    await queryInterface.bulkInsert('Players', allData.players, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Languages', null, {});
    await queryInterface.bulkDelete('Levels', null, {});
    await queryInterface.bulkDelete('Players', null, {});
  }
};

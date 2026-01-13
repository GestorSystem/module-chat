'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cha_channels', [
      {"name":"Exemplo 1"},
      {"name":"Exemplo 2"},
      {"name":"Exemplo 3"}
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cha_channels', null, {});
  }
};

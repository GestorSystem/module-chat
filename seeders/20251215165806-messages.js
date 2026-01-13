'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cha_messages', [
      {"message":"Exemplo 1"},
      {"message":"Exemplo 2"},
      {"message":"Exemplo 3"}
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cha_messages', null, {});
  }
};

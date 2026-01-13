'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar índices para melhor performance nas foreign keys
    // As foreign keys já foram criadas na migration create-messages
    // Aqui apenas adicionamos índices se necessário
    
    try {
      await queryInterface.addIndex('cha_messages', ['id_conversations'], {
        name: 'idx_messages_id_conversations'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_messages_id_conversations:', error.message);
      }
    }
    
    try {
      await queryInterface.addIndex('cha_messages', ['id_pessoa'], {
        name: 'idx_messages_id_pessoa'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_messages_id_pessoa:', error.message);
      }
    }
    
    try {
      await queryInterface.addIndex('cha_messages', ['id_user'], {
        name: 'idx_messages_id_user'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_messages_id_user:', error.message);
      }
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('cha_messages', 'idx_messages_id_user');
    } catch (error) {
      // Ignorar se não existir
    }
    
    try {
      await queryInterface.removeIndex('cha_messages', 'idx_messages_id_pessoa');
    } catch (error) {
      // Ignorar se não existir
    }
    
    try {
      await queryInterface.removeIndex('cha_messages', 'idx_messages_id_conversations');
    } catch (error) {
      // Ignorar se não existir
    }
  }
};

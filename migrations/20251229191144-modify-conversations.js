'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar índices para melhor performance nas foreign keys
    // As foreign keys já foram criadas na migration create-conversations
    // Aqui apenas adicionamos índices se necessário
    
    try {
      await queryInterface.addIndex('cha_conversations', ['id_channels'], {
        name: 'idx_conversations_id_channels'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_conversations_id_channels:', error.message);
      }
    }
    
    try {
      await queryInterface.addIndex('cha_conversations', ['id_pessoa'], {
        name: 'idx_conversations_id_pessoa'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_conversations_id_pessoa:', error.message);
      }
    }
    
    try {
      await queryInterface.addIndex('cha_conversations', ['id_user'], {
        name: 'idx_conversations_id_user'
      });
    } catch (error) {
      // Ignorar se o índice já existir
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️  Erro ao criar índice idx_conversations_id_user:', error.message);
      }
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('cha_conversations', 'idx_conversations_id_user');
    } catch (error) {
      // Ignorar se não existir
    }
    
    try {
      await queryInterface.removeIndex('cha_conversations', 'idx_conversations_id_pessoa');
    } catch (error) {
      // Ignorar se não existir
    }
    
    try {
      await queryInterface.removeIndex('cha_conversations', 'idx_conversations_id_channels');
    } catch (error) {
      // Ignorar se não existir
    }
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar sistema Manager (id_system: 1)
    const systems = await queryInterface.sequelize.query(
      "SELECT id FROM sys_systems WHERE sigla = 'MANAGER' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!systems || systems.length === 0) {
      console.log('⚠️  Sistema MANAGER não encontrado. Pulando criação de menu do Chat.');
      return;
    }
    
    const systemId = systems[0].id;
    
    // Verificar se o menu já existe
    const existingMenus = await queryInterface.sequelize.query(
      "SELECT id FROM sys_menus WHERE name = 'Chat' AND id_system = :systemId LIMIT 1",
      {
        replacements: { systemId },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    
    if (existingMenus && existingMenus.length > 0) {
      console.log('⚠️  Menu "Chat" já existe. Pulando criação.');
      return;
    }
    
    // Inserir Menu Chat
    const menuResult = await queryInterface.sequelize.query(
      `INSERT INTO sys_menus (name, id_system, id_organization, createdAt, updatedAt) 
       VALUES ('Chat', :systemId, NULL, NOW(), NOW())`,
      {
        replacements: { systemId },
        type: queryInterface.sequelize.QueryTypes.INSERT
      }
    );
    
    // Extrair o ID do resultado do INSERT
    // O formato pode variar: [insertId, affectedRows] ou apenas insertId
    let menuId;
    if (Array.isArray(menuResult) && menuResult.length > 0) {
      menuId = Array.isArray(menuResult[0]) ? menuResult[0][0] : menuResult[0];
    } else {
      menuId = menuResult;
    }
    
    // Se ainda não tiver o ID, buscar o último inserido
    if (!menuId) {
      const lastMenu = await queryInterface.sequelize.query(
        "SELECT id FROM sys_menus WHERE name = 'Chat' AND id_system = :systemId ORDER BY id DESC LIMIT 1",
        {
          replacements: { systemId },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );
      if (lastMenu && lastMenu.length > 0) {
        menuId = lastMenu[0].id;
      }
    }
    
    // Inserir MenuItem para Conversations
    await queryInterface.sequelize.query(
      `INSERT INTO sys_menu_items 
       (name, icon, route, target_blank, id_menu, id_system, id_organization, id_role, \`order\`, createdAt, updatedAt) 
       VALUES 
       ('Conversas', 'chat', '/crud/conversations', 0, :menuId, :systemId, NULL, NULL, 1, NOW(), NOW())`,
      {
        replacements: { menuId, systemId },
        type: queryInterface.sequelize.QueryTypes.INSERT
      }
    );
    
    console.log('✅ Menu "Chat" criado com sucesso!');
  },

  async down(queryInterface, Sequelize) {
    // Remover menu items do Chat
    await queryInterface.sequelize.query(
      "DELETE FROM sys_menu_items WHERE id_menu IN (SELECT id FROM sys_menus WHERE name = 'Chat')"
    );
    
    // Remover menu Chat
    await queryInterface.sequelize.query(
      "DELETE FROM sys_menus WHERE name = 'Chat'"
    );
  }
};


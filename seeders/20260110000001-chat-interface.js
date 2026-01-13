'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar se o CRUD já existe
    const existingCruds = await queryInterface.sequelize.query(
      "SELECT id FROM sys_cruds WHERE name = 'conversations' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (existingCruds && existingCruds.length > 0) {
      console.log('⚠️  CRUD "conversations" já existe. Atualizando configuração...');
      
      // Atualizar config existente
      const config = {
        title: 'Conversas',
        icon: 'chat',
        resource: 'Conversations',
        endpoint: '/api/conversations',
        rowKey: 'id',
        createRoute: '/crud/conversations/new',
        editRoute: '/crud/conversations/:id',
        deleteMessage: 'Deseja realmente excluir esta conversa?',
        deleteSuccessMessage: 'Conversa excluída com sucesso!',
        // Componente customizado para visualização
        customComponent: '@gestor/chat/frontend/src/Conversations.vue',
        columns: [
          {
            name: 'id',
            label: 'ID',
            align: 'center',
            field: 'id',
            sortable: true,
            style: 'min-width: 80px'
          },
          {
            name: 'pessoa',
            label: 'Pessoa',
            align: 'left',
            field: 'Pessoa.nome',
            sortable: true,
            style: 'min-width: 200px'
          },
          {
            name: 'channel',
            label: 'Canal',
            align: 'left',
            field: 'Channels.name',
            sortable: true,
            style: 'min-width: 150px'
          },
          {
            name: 'user',
            label: 'Usuário',
            align: 'left',
            field: 'User.name',
            sortable: true,
            style: 'min-width: 150px'
          },
          {
            name: 'createdAt',
            label: 'Criado em',
            align: 'center',
            field: 'createdAt',
            sortable: true,
            format: 'datetime',
            style: 'min-width: 180px'
          }
        ],
        fields: [
          {
            name: 'id_pessoa',
            label: 'Pessoa',
            type: 'select',
            required: true,
            optionsEndpoint: '/api/pessoas',
            optionLabel: 'nome',
            optionValue: 'id',
            rules: ['val => !!val || "Pessoa é obrigatória"']
          },
          {
            name: 'id_channels',
            label: 'Canal',
            type: 'select',
            required: false,
            optionsEndpoint: '/api/channels',
            optionLabel: 'name',
            optionValue: 'id'
          },
          {
            name: 'id_user',
            label: 'Usuário',
            type: 'select',
            required: false,
            optionsEndpoint: '/api/users',
            optionLabel: 'name',
            optionValue: 'id'
          }
        ],
        relations: [
          {
            model: 'Pessoa',
            field: 'id_pessoa',
            as: 'Pessoa',
            attributes: ['id', 'nome', 'email', 'telefone']
          },
          {
            model: 'Channels',
            field: 'id_channels',
            as: 'Channels',
            attributes: ['id', 'name']
          },
          {
            model: 'User',
            field: 'id_user',
            as: 'User',
            attributes: ['id', 'name', 'email']
          }
        ]
      };
      
      await queryInterface.sequelize.query(
        `UPDATE sys_cruds 
         SET config = :config, 
             title = 'Conversas',
             icon = 'chat',
             resource = 'Conversations',
             endpoint = '/api/conversations',
             active = 1,
             updatedAt = NOW()
         WHERE name = 'conversations'`,
        {
          replacements: { config: JSON.stringify(config) },
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
      
      console.log('✅ CRUD "conversations" atualizado com sucesso!');
      return;
    }
    
    // Criar novo CRUD
    const config = {
      title: 'Conversas',
      icon: 'chat',
      resource: 'Conversations',
      endpoint: '/api/conversations',
      rowKey: 'id',
      createRoute: '/crud/conversations/new',
      editRoute: '/crud/conversations/:id',
      deleteMessage: 'Deseja realmente excluir esta conversa?',
      deleteSuccessMessage: 'Conversa excluída com sucesso!',
      // Componente customizado para visualização
      customComponent: '@gestor/chat/frontend/src/Conversations.vue',
      columns: [
        {
          name: 'id',
          label: 'ID',
          align: 'center',
          field: 'id',
          sortable: true,
          style: 'min-width: 80px'
        },
        {
          name: 'pessoa',
          label: 'Pessoa',
          align: 'left',
          field: 'Pessoa.nome',
          sortable: true,
          style: 'min-width: 200px'
        },
        {
          name: 'channel',
          label: 'Canal',
          align: 'left',
          field: 'Channels.name',
          sortable: true,
          style: 'min-width: 150px'
        },
        {
          name: 'user',
          label: 'Usuário',
          align: 'left',
          field: 'User.name',
          sortable: true,
          style: 'min-width: 150px'
        },
        {
          name: 'createdAt',
          label: 'Criado em',
          align: 'center',
          field: 'createdAt',
          sortable: true,
          format: 'datetime',
          style: 'min-width: 180px'
        }
      ],
      fields: [
        {
          name: 'id_pessoa',
          label: 'Pessoa',
          type: 'select',
          required: true,
          optionsEndpoint: '/api/pessoas',
          optionLabel: 'nome',
          optionValue: 'id',
          rules: ['val => !!val || "Pessoa é obrigatória"']
        },
        {
          name: 'id_channels',
          label: 'Canal',
          type: 'select',
          required: false,
          optionsEndpoint: '/api/channels',
          optionLabel: 'name',
          optionValue: 'id'
        },
        {
          name: 'id_user',
          label: 'Usuário',
          type: 'select',
          required: false,
          optionsEndpoint: '/api/users',
          optionLabel: 'name',
          optionValue: 'id'
        }
      ],
      relations: [
        {
          model: 'Pessoa',
          field: 'id_pessoa',
          as: 'Pessoa',
          attributes: ['id', 'nome', 'email', 'telefone']
        },
        {
          model: 'Channels',
          field: 'id_channels',
          as: 'Channels',
          attributes: ['id', 'name']
        },
        {
          model: 'User',
          field: 'id_user',
          as: 'User',
          attributes: ['id', 'name', 'email']
        }
      ]
    };
    
    await queryInterface.sequelize.query(
      `INSERT INTO sys_cruds 
       (name, title, icon, resource, endpoint, active, isSystem, config, createdAt, updatedAt) 
       VALUES 
       ('conversations', 'Conversas', 'chat', 'Conversations', '/api/conversations', 1, 0, :config, NOW(), NOW())`,
      {
        replacements: { config: JSON.stringify(config) },
        type: queryInterface.sequelize.QueryTypes.INSERT
      }
    );
    
    console.log('✅ CRUD "conversations" criado com sucesso!');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DELETE FROM sys_cruds WHERE name = 'conversations'"
    );
  }
};


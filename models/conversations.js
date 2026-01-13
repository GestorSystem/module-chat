'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The Conversations `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Verificar se a model existe antes de associar
      if (models.Channels) {
        Conversations.belongsTo(models.Channels, { foreignKey: 'id_channels', as: 'Channels' });
      }
      // Verificar se a model existe antes de associar
      if (models.Pessoa && !Conversations.associations.Pessoa) {
        Conversations.belongsTo(models.Pessoa, { foreignKey: 'id_pessoa', as: 'Pessoa' });
      }
      // Verificar se a model existe antes de associar
      if (models.User) {
        Conversations.belongsTo(models.User, { foreignKey: 'id_user', as: 'User' });
      }
    }
  }
  Conversations.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_channels: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Channels',
        key: 'id'
      }
    },
    id_pessoa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pes_pessoas',
        key: 'id'
      },
      comment: 'ID da pessoa relacionada à conversa'
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Conversations',
    tableName: 'cha_conversations'
  });
  return Conversations;
};

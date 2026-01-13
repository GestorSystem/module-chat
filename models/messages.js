'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The Messages `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Verificar se a model existe antes de associar
      if (models.Conversations) {
        Messages.belongsTo(models.Conversations, { foreignKey: 'id_conversations', as: 'Conversations' });
      }
      // Verificar se a model existe antes de associar
      if (models.User) {
        Messages.belongsTo(models.User, { foreignKey: 'id_user', as: 'User' });
      }
      // Verificar se a model existe antes de associar
      if (models.Pessoa && !Messages.associations.Pessoa) {
        Messages.belongsTo(models.Pessoa, { foreignKey: 'id_pessoa', as: 'Pessoa' });
      }
    }
  }
  Messages.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    message: DataTypes.STRING,
    origin_id: DataTypes.INTEGER,
    id_conversations: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Conversations',
        key: 'id'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
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
      comment: 'ID da pessoa que enviou a mensagem'
    },
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Messages',
    tableName: 'cha_messages'
  });
  return Messages;
};

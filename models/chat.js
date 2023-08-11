'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User,{foreignKey:'userId'})
      Chat.belongsTo(models.Channel,{foreignKey:'channelId'})
    }
  }
  Chat.init({
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
    tableName:'Chats',
    underscored: true,
  });
  return Chat;
};
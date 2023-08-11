'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Channel.hasMany(models.Chat,{foreignKey:'channelId'})
    }
  }
  Channel.init({
    userOne: DataTypes.INTEGER,
    userTwo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Channel',
    tableName:'Channels',
    underscored: true,
  });
  return Channel;
};
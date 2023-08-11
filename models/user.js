'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order,{foreignKey:'userId'})
      User.hasMany(models.Cart,{foreignKey:'userId'})
      User.hasMany(models.Chat,{foreignKey:'userId'})
      User.belongsToMany(models.Product,{
        through: models.Favorite,
        foreignKey:'userId',
        as:'FavoritedProduct'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    isAdmin:DataTypes.BOOLEAN,
    account:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName:'Users',
    underscored: true,
  });
  return User;
};
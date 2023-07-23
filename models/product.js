'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category,{foreignKey:'categoryId'})
      Product.hasMany(models.Cart,{foreignKey:'productId'})
      Product.belongsToMany(models.User,{
        through:models.Favorite,
        foreignKey:'productId',
        as:'FavoritedUser'
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    image: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    isSelling:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
    tableName:'Products',
    underscored: true,
  });
  return Product;
};
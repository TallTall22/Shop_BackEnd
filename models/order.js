'use strict';
const { date } = require('faker/lib/locales/ar');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User,{foreignKey:'userId'})
      Order.hasMany(models.Cart,{foreignKey:'orderId'})
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN,
    isSent: DataTypes.BOOLEAN,
    isCheck: DataTypes.BOOLEAN,
    address:DataTypes.STRING,
    phone:DataTypes.STRING,
    paidMethod:DataTypes.STRING,
    name:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName:'Orders',
    underscored: true,
  });
  return Order;
};
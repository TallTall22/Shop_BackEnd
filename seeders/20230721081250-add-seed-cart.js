'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      'Select id from Products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'Select id from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const orders = await queryInterface.sequelize.query(
      'Select id from Orders;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Carts',[{
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[2].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[1].id,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[2].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[1].id,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[2].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[1].id,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[2].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[1].id,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[1].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[0].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[3].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[2].id,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      product_id:products[Math.floor(Math.random()*products.length)].id,
      user_id:users[4].id,
      quantity:Math.floor(Math.random()*30)+5,
      order_id:orders[3].id,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts',{})
  }
};

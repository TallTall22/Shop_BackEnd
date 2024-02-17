'use strict';
/** @type {import('sequelize-cli').Migration} */
const productList =require('../productList.json')
module.exports = {
  async up (queryInterface, Sequelize) {
    const productsWithTimestamps = productList.map(product => ({
      ...product,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('Products', productsWithTimestamps);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products',{})
  }
};

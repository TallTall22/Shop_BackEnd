'use strict';
/** @type {import('sequelize-cli').Migration} */
const faker=require('faker')
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'Select id from Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',Array.from({length:50},()=>({
      name:faker.name.findName(),
      price:Math.floor(Math.random()*200)*10+200,
      description:faker.lorem.text(),
      quantity:Math.floor(Math.random()*200),
      image:faker.image.unsplash.image(300, 400, 'fashion'),
      category_id:categories[Math.floor(Math.random() * categories.length)].id,
      is_selling:true,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products',{})
  }
};

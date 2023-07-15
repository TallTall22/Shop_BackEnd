'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',[
      '短袖上衣','外套','毛衣','牛仔褲','短褲','連身洋裝','配件'
    ].map(item=>{
      return {
        name:item,
        created_at: new Date(),
        updated_at: new Date()
      }
    }),{}    
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories',{})
  }
};

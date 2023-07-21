'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'Select id from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Orders',[{
      user_id:users[1].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:true,
      is_sent:false,
      is_check:true,
      address:users[1].address,
      phone:users[1].phone,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      user_id:users[2].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:false,
      is_sent:false,
      is_check:false,
      address:users[2].address,
      phone:users[2].phone,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      user_id:users[3].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:true,
      is_sent:false,
      is_check:true,
      address:users[3].address,
      phone:users[3].phone,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id:users[4].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:true,
      is_sent:true,
      is_check:true,
      address:users[4].address,
      phone:users[4].phone,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders',{})
  }
};

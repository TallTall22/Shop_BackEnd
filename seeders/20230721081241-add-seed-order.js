'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userId = await queryInterface.sequelize.query(
      'Select id from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const userAddress = await queryInterface.sequelize.query(
      'Select address from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const userPhone = await queryInterface.sequelize.query(
      'Select phone from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const userName = await queryInterface.sequelize.query(
      'Select name from Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Orders',[{
      user_id:userId[1].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:true,
      is_sent:false,
      is_check:true,
      address:userAddress[1].address,
      phone:userPhone[1].phone,
      name:userName[1].name,
      paid_method:'信用卡支付',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      user_id:userId[2].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:false,
      is_sent:false,
      is_check:false,
      address:userAddress[2].address,
      phone:userPhone[2].phone,
      name:userName[2].name,
      created_at: new Date(),
      updated_at: new Date()
    },
     {
      user_id:userId[3].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:false,
      is_sent:false,
      is_check:true,
      address:userAddress[3].address,
      phone:userPhone[3].phone,
      name:userName[3].name,
      paid_method:'貨到付款',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id:userId[4].id,
      amount:3000+Math.floor(Math.random()*100)*100,
      is_paid:true,
      is_sent:true,
      is_check:true,
      address:userAddress[4].address,
      phone:userPhone[4].phone,
      name:userName[4].name,
      paid_method:'信用卡支付',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders',{})
  }
};

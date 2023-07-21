'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt=require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',[{
      email: 'seller001@example.com',
      password: await bcrypt.hash('titaner', 10),
      is_admin: true,
      account:'seller001',
      name: 'SHOP',
      phone:'02-27821100',
      address:'台北市南港區園區街 30 之 10 號 1 樓之 1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'buyer678@example.com',
      password: await bcrypt.hash('titaner', 10),
      is_admin: false,
      account:'buyer678',
      name: '張子房',
      gender:'男',
      phone:'0912345678',
      address:'台北市信義區市府路45號',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'buyer789@example.com',
      password: await bcrypt.hash('titaner', 10),
      is_admin: false,
      account:'buyer789',
      name: '張良',
      gender:'男',
      phone:'0912345679',
      address:'台北市士林區至善路二段221號',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'buyer012@example.com',
      password: await bcrypt.hash('titaner', 10),
      is_admin: false,
      account:'buyer012',
      name: '張麗華',
      gender:'女',
      phone:'0934567890',
      address:'臺北市士林區福林路60號',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'buyer345@example.com',
      password: await bcrypt.hash('titaner', 10),
      is_admin: false,
      account:'buyer345',
      name: '武曌',
      gender:'女',
      phone:'0987654321',
      address:'台北市中正區重慶南路一段122號',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

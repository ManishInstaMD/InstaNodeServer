'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      UPDATE Users
      SET role = 'superadmin'
      WHERE email = 'manish@skbinfocom.in' AND role = 'admin';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      UPDATE Users
      SET role = 'admin'
      WHERE email = 'manish@skbinfocom.in' AND role = 'superadmin';
    `);
  }
};

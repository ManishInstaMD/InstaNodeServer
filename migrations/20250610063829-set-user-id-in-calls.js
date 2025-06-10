'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Set user_id = 11 for all rows in the "calls" table
    await queryInterface.sequelize.query(`
      UPDATE calls
      SET user_id = 11
    `);
  },

  async down(queryInterface, Sequelize) {
    // Optional: Reset user_id to NULL in case of rollback
    await queryInterface.sequelize.query(`
      UPDATE calls
      SET user_id = NULL
    `);
  }
};

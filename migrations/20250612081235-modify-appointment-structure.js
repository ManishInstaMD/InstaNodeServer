'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('appointment', 'create_date');

    await queryInterface.addColumn('appointment', 'remarks', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add timestamps if they don't exist already
    await queryInterface.addColumn('appointment', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('appointment', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointment', 'create_date', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('appointment', 'remarks');
    await queryInterface.removeColumn('appointment', 'createdAt');
    await queryInterface.removeColumn('appointment', 'updatedAt');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('calls', 'subject');
    await queryInterface.removeColumn('calls', 'description');
    await queryInterface.addColumn('calls', 'remark', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('calls', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('calls', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.removeColumn('calls', 'remark');
  }
};

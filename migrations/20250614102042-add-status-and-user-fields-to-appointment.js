'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointment', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('appointment', 'created_by', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('appointment', 'updated_by', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('appointment', 'status');
    await queryInterface.removeColumn('appointment', 'created_by');
    await queryInterface.removeColumn('appointment', 'updated_by');
    
    // For PostgreSQL you might need to also drop the enum type
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_appointment_status";');
  }
};
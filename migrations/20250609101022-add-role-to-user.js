"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add the new column `role` to User table, non-nullable with default 'admin'
    await queryInterface.addColumn("User", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "admin",
    });

    // 2. Update existing rows where role is null or empty to 'admin'
    // (Optional since defaultValue handles new inserts)
    await queryInterface.sequelize.query(
      `UPDATE User SET role = 'admin' WHERE role IS NULL OR role = ''`
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the column in case of rollback
    await queryInterface.removeColumn("User", "role");
  },
};

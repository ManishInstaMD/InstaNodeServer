"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("User", "role", {
      type: Sequelize.ENUM("superadmin", "admin", "sales", "marketing", "accounts"),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // In down migration, remove 'superadmin' by redefining original ENUM
    await queryInterface.changeColumn("User", "role", {
      type: Sequelize.ENUM("admin", "sales", "marketing", "accounts"),
      allowNull: false,
    });
  },
};

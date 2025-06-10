'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("calls", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "User", // exact table name
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // or "CASCADE" depending on your business rule
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("calls", "user_id");
  },
};

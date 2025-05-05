const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const master_therapy = sequelize.define(
  "master_therapy",
  {
    therapy_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    therapy_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    therapy_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "master_therapy",
    timestamps: false,
  }
);

module.exports = master_therapy;

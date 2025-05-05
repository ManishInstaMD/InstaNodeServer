const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); 
const appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    person_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    person_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    appointment_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    create_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "appointment",
    timestamps: false,
  }
);

module.exports = appointment;

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
    pmt_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
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
    status:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    person_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appointment_date: {
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
    timestamps: true,
  }
);

module.exports = appointment;

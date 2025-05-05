const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Adjust path as needed

const company_estimate = sequelize.define(
  "company_estimate",
  {
    estimate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimate_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimate_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customer_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bd_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimate_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    terms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_approved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "company_estimate",
    timestamps: false,
  }
);

module.exports = company_estimate;

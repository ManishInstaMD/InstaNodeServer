// models/Product.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const product_table = sequelize.define(
  "product_table",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manufactured_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expire_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    product_batch_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_table",
    timestamps: false,
  }
);

module.exports = product_table;

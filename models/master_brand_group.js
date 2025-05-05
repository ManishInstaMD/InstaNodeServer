const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Adjust based on your DB config file

const master_brand_group = sequelize.define(
  "master_brand_group",
  {
    bg_id: {
      type: DataTypes.INTEGER(100),
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    division_id: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    division_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    team: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "0",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    brand_logo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "default.jpg",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: 0,
    },
    molecule: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    generic_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    usp: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    about: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    promotogram: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    is_leaderboard: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: 1,
    },
    is_combination: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "master_brand_group",
    timestamps: false,
  }
);

module.exports = master_brand_group;

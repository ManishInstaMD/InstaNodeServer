const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const pmt_master
= sequelize.define(
  "pmt_master",
  {
    pmt_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pmt_key: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    division_id: {
      type: DataTypes.INTEGER,
    },
    pmt_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(255),
    },
    division_name: {
      type: DataTypes.STRING(255),
    },
    company_email: {
      type: DataTypes.STRING(255),
    },
    personal_email: {
      type: DataTypes.STRING(255),
    },
    mobile_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    alternate_mobile: {
      type: DataTypes.STRING(255),
    },
    pmt_photo: {
      type: DataTypes.STRING(255),
    },
    pmt_dob: {
      type: DataTypes.STRING(255),
    },
    pmt_doa: {
      type: DataTypes.STRING(255),
    },
    pmt_address: {
      type: DataTypes.TEXT("long"),
    },
    city: {
      type: DataTypes.STRING(255),
    },
    state: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.DATE,
    },
    update_date: {
      type: DataTypes.DATE,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    targeted_for: {
      type: DataTypes.STRING(355),
    },
    linkedin: {
      type: DataTypes.TEXT,
    },
    facebook: {
      type: DataTypes.TEXT,
    },
    instagram: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "pmt_master",
    timestamps: false, // Since create_date and update_date are handled manually
  }
);

module.exports = pmt_master;

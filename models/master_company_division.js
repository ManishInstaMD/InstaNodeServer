const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); 

const master_company_division = sequelize.define(
  "master_company_division",
  {
    division_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    division_key: {
      type: DataTypes.STRING(500),
      unique: true,
    },
    division_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    division_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    division_short_name: DataTypes.STRING(255),
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
    },
    country: DataTypes.STRING(255),
    gstin: DataTypes.STRING(255),
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "1",
    },
    is_delete: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0",
    },
    profile_photo: DataTypes.STRING(100),
    bgimage: DataTypes.STRING(100),
    division_logo: DataTypes.STRING(100),
    welcome_msg: DataTypes.TEXT,
    verification_SMS: DataTypes.STRING(1000),
    docbd_msg: DataTypes.TEXT,
    sender_id: DataTypes.STRING(100),
    android_icon: DataTypes.STRING(100),
    iphone_icon: DataTypes.STRING(100),
    app_name: DataTypes.STRING(100),
    doctor_speciality: DataTypes.TEXT,
    doctor_category: DataTypes.TEXT,
    doctor: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    hospital: DataTypes.STRING(100),
    chemist: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    distributors: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price_list: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    engage: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    evaluate: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    rx: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    pob: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    activities: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    events: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: DataTypes.STRING(255),
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    update_date: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "master_company_division",
    timestamps: false,
  }
);

module.exports = master_company_division;

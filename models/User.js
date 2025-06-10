const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role:{
      type: DataTypes.ENUM('admin', 'sales', 'marketing','accounts'),
      allowNull:false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    blocked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationImages:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER, 
      defaultValue: 1 
    }
  },
  {
    tableName: "User",
    timestamps: true,
  }
);

module.exports = User;

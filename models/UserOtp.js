const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserOtp = sequelize.define(
  "UserOtp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "UserOtp",
    timestamps: true,
  }
);

module.exports = UserOtp;

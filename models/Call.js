// models/Call.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const Call = sequelize.define('Call', {
  call_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pmt_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_delete: {    // soft delete flag (optional)
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'calls',
  timestamps: true, 
});

module.exports = Call;

// models/Call.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const Call = sequelize.define('Call', {
  call_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pmt_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
   remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_delete: {    
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'calls',
  timestamps: true, 
});

module.exports = Call;

const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const pob = sequelize.define("pob", {
  pobid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  docid: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  pg_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  chemist_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  doctor_name: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  empid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  division_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  brand_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  brand_name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  pob: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  chemist: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  score: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "0",
  },
  create_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_delete: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_approved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pob_group: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_delivered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stockist: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  photo_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  abm_remarks: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  user_role: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  chemist_mobile: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pob_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "pob",
  timestamps: false,
});

module.exports = pob;

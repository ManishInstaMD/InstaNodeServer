const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Adjust based on your setup

const master_company = sequelize.define(
  "master_company",
  {
    company_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    company_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pharma",
    },
    company_name: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    company_full_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    comapny_about: {
      type: DataTypes.TEXT("long"),
    },
    founded_in: {
      type: DataTypes.STRING(10),
    },
    founder_name: {
      type: DataTypes.STRING(500),
    },
    company_size: {
      type: DataTypes.STRING(200),
    },
    company_revenue: {
      type: DataTypes.STRING(200),
    },
    company_address: {
      type: DataTypes.TEXT,
    },
    company_city: {
      type: DataTypes.STRING(255),
    },
    company_state: {
      type: DataTypes.STRING(200),
    },
    company_pincode: {
      type: DataTypes.STRING(100),
    },
    company_website: {
      type: DataTypes.STRING(200),
    },
    company_type: {
      type: DataTypes.STRING(200),
    },
    company_contact_person: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company_phone: {
      type: DataTypes.STRING(20),
    },
    company_mobile: {
      type: DataTypes.STRING(255),
    },
    company_username: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    company_logo: {
      type: DataTypes.STRING(1000),
    },
    company_password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    company_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    company_priority: {
      type: DataTypes.STRING(255),
    },
    is_delete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    company_rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_divisions: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    total_products: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    total_pmts: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    active_users: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    doctor_coverage: {
      type: DataTypes.STRING(255),
      defaultValue: "0",
    },
    chemist_coverage: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    total_stockist: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    invoiced_amount: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    payment_received: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
    },
    company_gstn: {
      type: DataTypes.STRING(255),
    },
    create_date: {
      type: DataTypes.DATE,
    },
    update_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "master_company",
    timestamps: false, // Since create_date and update_date are handled manually
  }
);

module.exports = master_company;

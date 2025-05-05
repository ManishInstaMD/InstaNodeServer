const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Import your Sequelize instance

const company_sales_invoice = sequelize.define(
  "company_sales_invoice",
  {
    invoice_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_key: {
      type: DataTypes.STRING,
      unique: true,
    },
    sale_type: {
      type: DataTypes.STRING(500),
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    division_id: {
      type: DataTypes.INTEGER,
    },
    customer_code: {
      type: DataTypes.STRING,
    },
    customer_id: {
      type: DataTypes.INTEGER,
    },
    customer_type: {
      type: DataTypes.STRING,
    },
    customer_name: {
      type: DataTypes.STRING,
    },
    invoice_title: {
      type: DataTypes.TEXT,
    },
    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
    },
    invoice_due_date: {
      type: DataTypes.DATEONLY,
    },
    customer_company: {
      type: DataTypes.STRING,
    },
    customer_address: {
      type: DataTypes.TEXT,
    },
    customer_detail: {
      type: DataTypes.TEXT,
    },
    customer_gstn: {
      type: DataTypes.STRING,
    },
    invoice_terms: {
      type: DataTypes.TEXT,
    },
    sub_total_amount: {
      type: DataTypes.STRING,
    },
    discount_percent: {
      type: DataTypes.STRING,
    },
    discount_amount: {
      type: DataTypes.STRING,
    },
    tax_percent: {
      type: DataTypes.STRING,
    },
    tax_amount: {
      type: DataTypes.STRING,
    },
    total_amount: {
      type: DataTypes.STRING,
    },
    is_approved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.DATE,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_sent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status_text: {
      type: DataTypes.STRING,
      defaultValue: "Created",
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    po_number: {
      type: DataTypes.STRING,
    },
    place_of_supply: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "company_sales_invoice",
    timestamps: false,
  }
);

module.exports = company_sales_invoice;

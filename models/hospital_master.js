const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const hospital_master = sequelize.define(
  "hospital_master",
  {
    hospital_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    hospital_key: {
      type: DataTypes.STRING,
      unique: true,
    },
    hospital_code: {
      type: DataTypes.STRING,
      unique: true,
    },
    hospital_name: DataTypes.STRING,
    hospital_registration_number: DataTypes.STRING,
    hospital_register_from: DataTypes.STRING,
    hospital_mobile: DataTypes.STRING,
    hospital_alternate_mobile: DataTypes.STRING,
    hospital_email: DataTypes.STRING,
    hospital_speciality: DataTypes.STRING,
    hospital_type: DataTypes.STRING,
    hospital_category: DataTypes.STRING,
    hospital_area: DataTypes.STRING,
    hospital_areatype: DataTypes.STRING,
    hospital_address: DataTypes.STRING,
    hospital_city: DataTypes.STRING,
    hospital_district: DataTypes.STRING,
    hospital_state: DataTypes.STRING,
    hospital_pincode: DataTypes.STRING,
    hospital_country: DataTypes.STRING,
    lng: DataTypes.STRING,
    lat: DataTypes.STRING,
    total_doctors: DataTypes.INTEGER,
    total_beds: DataTypes.INTEGER,
    current_business: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_date: DataTypes.DATE,
    hospital_photo: DataTypes.TEXT,
    icu_bed: DataTypes.STRING,
    hospital_grade: DataTypes.STRING,
    total_ot: DataTypes.STRING,
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_verified: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hospital_existing: DataTypes.STRING,
    hospital_gstin: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
  },
  {
    tableName: "hospital_master",
    timestamps: false,
  }
);

module.exports = hospital_master;

const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Import database connection

const master_brand_generic = sequelize.define(
  "master_brand_generic",
  {
    generic_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    therapeutic_class: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    salient_features: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    therapy_group: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    adult_dosage: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    child_dosage: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    indications: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Food_Interaction: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Drug_Interaction: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Side_Effects: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Precautions: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Contraindication: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Advice_to_Patients: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Route_of_Administration: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Drug_Form: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Half_Life: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Pregnancy: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Bioactivity_Group: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    is_combination: {
      type: DataTypes.INTEGER(88),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER(88),
      allowNull: false,
    },
    Version_No: {
      type: DataTypes.INTEGER(88),
      allowNull: false,
    },
  },
  {
    tableName: "master_brand_generic",
    timestamps: false,
  }
);

module.exports = master_brand_generic;

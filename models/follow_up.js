const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); 
const follow_up = sequelize.define(
  "follow_up",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    person_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    follow_up_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followup_create_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "follow_up",
    timestamps: false,
  }
);

module.exports = follow_up;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Alkem = sequelize.define("Alkem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "alkem",
  timestamps: true,
});

module.exports = Alkem;

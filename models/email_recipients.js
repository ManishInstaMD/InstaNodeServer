const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const email_recipients = sequelize.define("email_recipients", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email_event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipient_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // e.g., "SENT", "OPENED", "CLICKED", "BOUNCED"
    defaultValue: "SENT",
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});



module.exports = email_recipients;

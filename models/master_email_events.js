const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const master_email_events = sequelize.define("master_email_events", {
  messageId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING, // 'Open', 'Click', 'Bounce', etc.
    allowNull: false,
  },
  campaign_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recipientEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkClicked: {
    type: DataTypes.TEXT, // Only for click events
    allowNull: true,
  },
  bounceType: {
    type: DataTypes.STRING, // For bounce events
    allowNull: true,
  },
  bounceSubType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rawEvent: {
    type: DataTypes.JSON, // Store the full parsed SES event
    allowNull: true,
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = master_email_events;

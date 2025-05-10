const db = require("../config/database");
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize'); 
const sendEmail = require("../utils/sendEmail");

exports.sendEmail = async (req, res) => {
  const { subject, body, recipients,campaign_name } = req.body;

  try {
    await sendEmail(subject, body, recipients, campaign_name);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Failed to send email" });
  }
};

// exports.handleSesWebhook = async (req, res) => {
//   try {
//     const snsPayload = req.body;

//     // Handle SNS subscription confirmation
//     if (snsPayload.Type === "SubscriptionConfirmation") {
//       console.log("🔔 Confirm the subscription:", snsPayload.SubscribeURL);
//       return res.status(200).send("Subscription confirmation received.");
//     }

//     if (snsPayload.Type !== "Notification") {
//       return res.status(400).send("Invalid message type.");
//     }

//     const sesEvent = JSON.parse(snsPayload.Message);

//     const { eventType, mail, open, click, bounce } = sesEvent;
//     const recipientEmail = mail.destination?.[0] || null;

//     // Add campaignName and subject to the record if available
//     const campaignName =
//       mail.tags
//         ?.find((tag) => tag.startsWith("campaignName:"))
//         ?.split(":")[1] || null;
//     const subject = mail.commonHeaders?.subject || null;

//     const record = {
//       messageId: mail.messageId,
//       eventType,
//       recipientEmail,
//       timestamp:
//         open?.timestamp ||
//         click?.timestamp ||
//         bounce?.timestamp ||
//         mail.timestamp,
//       ipAddress: open?.ipAddress || click?.ipAddress || null,
//       userAgent: open?.userAgent || null,
//       linkClicked: click?.link || null,
//       bounceType: bounce?.bounceType || null,
//       bounceSubType: bounce?.bounceSubType || null,
//       rawEvent: sesEvent,
//       campaignName,
//       subject,
//     };

//     await db.models.master_email_events.create(record);
//     res.status(200).send("Event saved successfully.");
//   } catch (error) {
//     console.error(" SES Webhook Error:", error);
//     res.status(500).send("Internal server error.");
//   }
// };

// Function to confirm SNS subscription
const confirmSubscription = async (url) => {
  try {
    const response = await fetch(url);
    console.log("SNS subscription confirmed.");
  } catch (error) {
    console.error("Error confirming SNS subscription:", error);
    throw error;
  }
};

// Function to handle SES notification
const handleSesNotification = async (snsMessage) => {
  try {
    // Parse the SNS message
    const message = JSON.parse(snsMessage.Message); // SES event message
    const eventType = message.eventType; // OPEN, CLICK, etc.
    const emailEventId = message.mail.messageId; // SES message ID

    // Handle OPEN or CLICK events (you can add more event types if needed)
    if (eventType === "OPEN" || eventType === "CLICK") {
      const recipientEmail = message.mail.destination[0]; // First recipient (assuming only one)

      // Update the recipient status in the email_recipients table
      await db.models.email_recipients.update(
        { status: eventType }, // Set status to 'OPEN' or 'CLICK'
        {
          where: {
            email_event_id: emailEventId,
            recipient_email: recipientEmail,
          },
        }
      );

      console.log(`Updated recipient ${recipientEmail} status to ${eventType}`);
    }
  } catch (error) {
    console.error("Error processing SES notification:", error);
    throw error;
  }
};

// Main function for SES Webhook
exports.handleSesWebhook = async (req, res) => {
  try {
    const snsMessage = req.body;

    // Verify if it's a subscription confirmation message from SNS
    if (snsMessage.Type === "SubscriptionConfirmation") {
      const url = snsMessage.SubscribeURL;
      await confirmSubscription(url);
      return res.status(200).send("Subscription confirmed");
    }

    if (snsMessage.Type === "Notification") {
      await handleSesNotification(snsMessage);
      return res.status(200).send("SES notification processed");
    }

    return res.status(400).send("Invalid SNS message");
  } catch (error) {
    console.error("Error handling SES webhook:", error);
    return res.status(500).send("Error processing notification");
  }
};







//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exports.getCampaignStats = async (req, res) => {
  try {
    // Fetch campaign stats, including total sent and total read
    const stats = await db.models.master_email_events.findAll({
      attributes: [
        'id', // Include the id in SELECT
        'campaign_name',
        'subject',
        [Sequelize.fn('COUNT', Sequelize.col('recipients.id')), 'total_sent'], // Count of recipients
        [
          Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN recipients.status = "OPEN" THEN 1 END')),
          'total_read', // Count where the email was opened
        ],
        'timestamp',
      ],
      include: [
        {
          model: db.models.email_recipients,
          as: 'recipients', // Use alias defined in the association
          attributes: [], // Do not select columns from the recipients table
        },
      ],
      group: [
        'master_email_events.id', // Include the id in GROUP BY
        'master_email_events.campaign_name',
        'master_email_events.subject',
        'master_email_events.timestamp',
      ],
      order: [['timestamp', 'DESC']], // Order by the most recent events
    });

    // If no stats were found, return a message indicating so
    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: 'No email stats found' });
    }

    // Return the stats data
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return res.status(500).json({ message: 'Error fetching email stats' });
  }
};
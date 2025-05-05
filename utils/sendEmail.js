const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../config/database");

const { SESClient, SendRawEmailCommand } = require("@aws-sdk/client-ses");
const { Buffer } = require("buffer");

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendEmail = async (subject, body, recipients, campaign_name) => {
  if (
    !subject ||
    !body ||
    !Array.isArray(recipients) ||
    recipients.length === 0
  ) {
    throw new Error("Invalid email parameters");
  }

  const rawMessage = [
    `From: "InstaMD" <rohit7067842611@gmail.com>`,
    `To: rohit7067842611@gmail.com`,
    `Bcc: ${recipients.join(", ")}`,
    `Subject: ${subject}`,
    `X-Campaign-Name: ${campaign_name || subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\n");

  const params = {
    RawMessage: {
      Data: Buffer.from(rawMessage),
    },
    ConfigurationSetName: "LocalTrackingSet", // Replace with your config set name
  };

  try {
    const data = await sesClient.send(new SendRawEmailCommand(params));
    console.log("Email sent! Message ID:", data.MessageId);

    // Save email event
    const emailEvent = await db.models.master_email_events.create({
      messageId: data.MessageId,
      eventType: "SEND",
      timestamp: new Date(),
      campaign_name: campaign_name || 'New Campaign',
      subject: subject,
    });

    // Save each recipient
    await Promise.all(
      recipients.map(email =>
        db.models.email_recipients.create({
          email_event_id: emailEvent.id,
          recipient_email: email,
          status: 'SENT',
        })
      )
    );

    return { success: true, messageId: data.MessageId };
  } catch (err) {
    console.error("Error sending or saving email:", err);
    throw err;
  }
};

module.exports = sendEmail;

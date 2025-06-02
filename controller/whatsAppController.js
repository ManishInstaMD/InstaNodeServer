// controllers/whatsappController.js
const axios = require("axios");
require("dotenv").config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const sendWhatsappMessage = async (req, res) => {
  const { to, template } = req.body;

  if (!to || typeof to !== "string") {
    return res.status(400).json({ error: "Phone number is required." });
  }

  const templateName = template?.name;
  const languageCode = template?.language?.code;

  if (!templateName || !languageCode) {
    return res
      .status(400)
      .json({ error: "Template name and language code are required." });
  }

  try {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        // Remove components block if not needed
      },
    };

    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: `Message sent to ${to}` });
  } catch (err) {
    console.error(
      `Failed to send message to ${to}:`,
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
};

module.exports = { sendWhatsappMessage };
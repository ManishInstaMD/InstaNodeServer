const express = require("express");
const sendInviteEmail = require("../utils/mail2");
const app = express();

app.use(express.json());

router.post("/send-invite", async (req, res) => {
  const { toEmail, doctorName } = req.body;

  if (!toEmail || !doctorName) {
    return res.status(400).json({ message: "toEmail and doctorName are required" });
  }

  try {
    await sendInviteEmail(toEmail, doctorName);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

module.exports = router;


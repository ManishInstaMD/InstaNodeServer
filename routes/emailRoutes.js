const express = require("express");
const router = express.Router(); // You missed this line
const sendInviteEmail = require("../utils/mail2");
const db = require("../config/database");

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


// GET /api/users
router.get('/alkenUser', async (req, res) => {
  try {
    const users = await db.models.Alkem.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' , error: err.message});
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await db.models.Alkem.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

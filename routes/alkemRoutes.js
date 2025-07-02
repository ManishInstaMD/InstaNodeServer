const express = require("express");
const db = require("../config/database");
const router = express.Router();
const Alkem = require("../models/alkem");

// POST /api/alkem/createdoctor
router.post("/createdoctor", async (req, res) => {
  try {
    const { name, email , user_id } = req.body;

    // Basic validation
    if (!name || !email || !user_id) {
      return res.status(400).json({ message: "Name and email are required." });
    }
    const existingUser = await Alkem.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newEntry = await Alkem.create({ name, email , user_id});
    res.status(201).json({ message: "Doctor created successfully", data: newEntry });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/usercount", async (req, res) => {
  try {
    const total = await Alkem.count();
    res.status(200).json({ total });
  } catch (err) {
    console.error("Error counting doctors:", err);
    res.status(500).json({
      message: "Failed to count doctors",
      error: err.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Alkem = require("../models/alkem");

// POST /api/alkem/createdoctor
router.post("/createdoctor", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const newEntry = await Alkem.create({ name, email });
    res.status(201).json({ message: "Doctor created successfully", data: newEntry });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/docTotal", async (req, res) => {
  try {
    const total = await Alkem.count();
    res.status(200).json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count users", error: err.message });
  }
});

module.exports = router;

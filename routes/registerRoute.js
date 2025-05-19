const express = require("express");
const router = express.Router();
const db = require('../config/database');

// POST /api/register
router.post("/", async (req, res) => {
  try {
    const {
      name,
      companyName,
      division,
      designation,
      state,
      city,
      mobile,
      email,
    } = req.body;

    if (!name || !companyName || !mobile || !email) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const registration = await db.models.UserRegistration.create({
      name,
      companyName,
      division,
      designation,
      state,
      city,
      mobile,
      email,
    });

    res
      .status(201)
      .json({ message: "Registration successful", data: registration });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

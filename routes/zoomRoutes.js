const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const { createMeeting } = require("../zoom/zoom.service");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    try {
      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) return res.status(400).json({ error: "User already exists" });
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Save user with Zoom tokens
      user = await User.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
      });
      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
      console.log("User registered:", token); 
      res.json({ message: "Registration successful", token, user });
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      res.status(500).json({ error: "Registration failed" });
    }
  });

router.post("/meeting", createMeeting);

router.get("/userList", async (req, res) => {
    try {
        const users = await User.findAll(); 
        attributes: ["id", "fullName", "email", "phone", "zoomMeetingId", "zoomJoinUrl"]
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});


module.exports = router;

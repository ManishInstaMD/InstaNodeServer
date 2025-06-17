const express = require("express");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { name, email, password, role } = req.body;

    // 1. Check if user already exists (by email)
    const existingUser = await db.models.User.findOne({
      where: {
        [Op.or]: [{ email }, ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists"
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 3. Create user
    const newUser = await db.models.User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ success: false, message: "Error creating user", error });
  }
};


// READ: List all users (superadmin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

   const users = await db.models.User.findAll({
      where: {
        is_delete: 0,
        role: { [Op.not]: "superadmin" } // Exclude superadmin
      }
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error:error.message});
  }
};

// READ: Single user by ID
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await db.models.User.findByPk(req.params.id);
    if (!user || user.is_delete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user", error });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await db.models.User.findByPk(req.params.id);
    if (!user || user.is_delete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user", error });
  }
};

// DELETE (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await db.models.User.findByPk(req.params.id);
    if (!user || user.is_delete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update({ is_delete: 1 });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user", error });
  }
};

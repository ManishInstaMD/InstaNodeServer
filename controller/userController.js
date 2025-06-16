const express = require("express");
const db = require("../config/database");

// CREATE user (superadmin only)
exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { name, username, email, password, role } = req.body;

    const newUser = await db.models.User.create({ name, username, email, password, role });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating user", error });
  }
};

// READ: List all users (superadmin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const users = await db.models.User.findAll({ where: { is_delete: 0 } });
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

const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

// Create
router.post("/newAppoinment", appointmentController.createAppointment);

// Read
router.get("/appoinment/:id", appointmentController.getAppointmentById);

// Update
router.post("/appoinment/:id", appointmentController.updateAppointment);

// Soft Delete
router.post("/deleteAppointment/:id", appointmentController.deleteAppointment);

// List All
router.get("/listAppointments", appointmentController.listAppointments);

module.exports = router;
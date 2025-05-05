const myServices = require("../services/myServices");
const db = require("../config/database");

// Create new appointment
exports.createAppointment = async (req, res) => {
  const response = await myServices.create(db.models.appointment, req.body);
  res.status(response.success ? 200 : 400).json(response);
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  const response = await myServices.read(db.models.appointment, req.params.id);
  res.status(response.success ? 200 : 404).json(response);
};

// Update appointment by ID
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const response = await myServices.update(db.models.appointment, id, req.body);
  res.status(response.success ? 200 : 400).json(response);
};

// Soft delete appointment by ID
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await myServices.update(db.models.appointment, id, data);
  res.status(response.success ? 200 : 400).json(response);
};

// List all appointments
exports.listAppointments = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const response = await myServices.list(
    db.models.appointment,
    null,
    { is_delete: 0 },
    parseInt(limit),
    parseInt(offset)
  );
  res.status(response.success ? 200 : 400).json(response);
};

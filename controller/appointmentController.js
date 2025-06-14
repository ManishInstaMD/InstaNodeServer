const myServices = require("../services/myServices");
const db = require("../config/database");

// Create new appointment
exports.createAppointment = async (req, res) => {
  const response = await myServices.create(db.models.appointment, req.body);
  res.status(response.success ? 200 : 400).json(response);
};

// Get appointment by ID
// exports.getAppointmentById = async (req, res) => {
//   const response = await myServices.read(db.models.appointment, req.params.id);
//   res.status(response.success ? 200 : 404).json(response);
// };
(exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  // console.log("id", id);

  try {
    const result = await db.models.appointment.findAll({
      where: { pmt_id: id, is_delete: 0 },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: result,
      message: "Call found successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}),
  (exports.marketingAppointment = async (req, res) => {
    const { id } = req.params;
    // console.log("id", id);
    const response = await db.models.appointment.update(req.body, {
      where: { id: id },
    });
    res
      .status(200)
      .json({ success: true, message: "updated successfully", data: response });
  });

// Update appointment by ID
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  // console.log("id", id);
  const response = await db.models.appointment.update(req.body, {
    where: { pmt_id: id },
  });
  res
    .status(200)
    .json({ success: true, message: "updated successfully", data: response });
};

// Soft delete appointment by ID
// exports.deleteAppointment = async (req, res) => {
//   const { id } = req.params;
//   const data = req.body;
//   const response = await myServices.update(db.models.appointment, id, data);
//   res.status(response.success ? 200 : 400).json(response);
// };

// soft delete
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  // console.log("id", id);

  const response = await db.models.appointment.update(
    { is_delete: 1 },
    { where: { id: id } }
  );
  res
    .status(200)
    .json({ success: true, message: "deleted successfully", data: response });
};

//hard delete
exports.hardDeleteAppointment = async (req, res) => {
  const { id } = req.params;
  // console.log("id", id);

  const response = await db.models.appointment.destroy({ where: { id: id } });
  res
    .status(200)
    .json({ success: true, message: "deleted successfully", data: response });
};

// List all appointments
exports.listAppointments = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const response = await myServices.list(
    db.models.appointment,
    null,
    { is_delete: 0 },
    parseInt(limit),
    parseInt(offset),
     [['createdAt', 'DESC']]
  );
  res.status(response.success ? 200 : 400).json(response);
};

exports.list = async (req, res) => {
  try {
    const response = await db.models.appointment.findAll({
      where: { is_delete: 0 },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ 
      success: true, 
      message: "Appointments fetched successfully", 
      data: response 
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointments",
      error: error.message 
    });
  }
};

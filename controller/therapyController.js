const myServices = require("../services/myServices");
const db = require("../config/database");

const DoctorController = {
  create: async (req, res) => {
    try {
      const result = await myServices.create(db.models.master_therapy, req.body);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const result = await myServices.list(db.models.master_therapy, null, { is_delete: 0 });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  findById: async (req, res) => {
    try {
      const result = await myServices.read(db.models.master_therapy, req.params.id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const result = await myServices.update(db.models.master_therapy, req.params.id, req.body);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteById: async (req, res) => {
    const  { id } = req.params    
    console.log("id", id);
    
    const data = req.body
    const response = await myServices.update(db.models.master_therapy, id, data);
    res.status(response.success ? 200 : 400).json(response);
  }
};

module.exports = DoctorController;

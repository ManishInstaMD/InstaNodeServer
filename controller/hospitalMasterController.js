const db = require("../config/database");
const myServices = require("../services/myServices");

module.exports = {
  list: async (req, res) => {
    const result = await myServices.list(db.models.hospital_master, null, { is_delete: 0 });
    res.status(result.success ? 200 : 500).json(result);
  },

  create: async (req, res) => {
    const result = await myServices.create(db.models.hospital_master, req.body);
    res.status(result.success ? 201 : 500).json(result);
  },

  getById: async (req, res) => {
    const result = await myServices.getById(db.models.hospital_master, req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    console.log("id", id);
    const data = req.body;
    const result = await myServices.update(db.models.hospital_master,id, data);
    res.status(result.success ? 200 : 500).json(result);
  },

  deleteById: async (req, res) => {
    try {
      const record = await db.models.hospital_master.findByPk(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, message: "Hospital not found" });
      }
      await record.update({ is_delete: 1 });
      res.status(200).json({ success: true, message: "Hospital soft-deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

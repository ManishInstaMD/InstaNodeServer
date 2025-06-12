const db = require("../config/database");
const myServices = require('../services/myServices');

const callController = {
  createCall: async (req, res) => {
    try {
      const data = { ...req.body};
      console.log("data", data);
      
      const result = await myServices.create(db.models.Call, data);
      res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  listCalls: async (req, res) => {
    try {
      const { pmt_id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const where = { pmt_id, is_delete: false };
      const result = await myServices.list(db.models.Call, null, where, limit, offset);
      res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // getCall: async (req, res) => {
  //   const { id } = req.params;
  //   console.log("id", id);
    
  //   try {
  //     const result = await myServices.read(db.models.Call, id);
  //     res.status(result.success ? 200 : 404).json(result);
  //   } catch (err) {
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // },

 getCall: async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.models.Call.findAll({
      where: { pmt_id: id },
      order: [['createdAt', 'DESC']], // Change 'createdAt' to the field you want to sort by
    });

    res.status(200).json({
      success: true,
      data: result,
      message: "Call found successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},


  updateCall: async (req, res) => {
    try {
      const result = await myServices.update(db.models.Call, req.params.id, req.body);
      res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteCall: async (req, res) => {
    try {
      // Soft delete: update is_delete flag
      const result = await myServices.update(db.models.Call, req.params.id, { is_delete: true });
      res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  listAllCalls :async (req, res) => {
  try {
    const result = await myServices.list(db.models.Call, null, { is_delete: 0 }, 1000, 0); // limit can be adjusted
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all calls", error: error.message });
  }
},
};

module.exports = callController;

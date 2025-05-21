const db = require("../config/database");
const myServices = require("../services/myServices");
const crypto = require('crypto');

module.exports = {
  list: async (req, res) => {
    const result = await myServices.list(db.models.master_chemist, null, { is_delete: 0 });
    res.status(result.success ? 200 : 500).json(result);
  },

  create: async (req, res) => {
    const data = req.body;
    // console.log("data", data);
    
     // Check for existing mobile
  const existingChemist = await db.models.master_chemist.findOne({
    where: { mobile: data.mobile },
  });

  // console.log("existingChemist", existingChemist);
  

  if (existingChemist) {
    return res.status(409).json({
      success: false,
      message: "Chemist with this mobile number already exists",
    });
  }
    data.auth_key = crypto.randomBytes(16).toString('hex'); 
    if (!data.mobile || data.mobile === '0') {
      console.log("i am from mobile", data.mobile);
      
    }    
    const result = await myServices.create(db.models.master_chemist, data);
    res.status(result.success ? 201 : 500).json(result);
  },

  getById: async (req, res) => {
    const result = await myServices.getById(db.models.master_chemist, req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    console.log("id", id);
    const data = req.body;
    const result = await myServices.update(db.models.master_chemist,id, data);
    res.status(result.success ? 200 : 500).json(result);
  },

  deleteById: async (req, res) => {
    try {
      const record = await db.models.master_chemist.findByPk(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, message: "Chemist not found" });
      }
      await record.update({ is_delete: 1 });
      res.status(200).json({ success: true, message: "Chemist soft-deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const myServices = require('../services/myServices');
const db = require('../config/database');
const crypto = require('crypto');

const getstockistById = async (req, res) => {
    try {
      const stockistId = req.params.stockistID;
      const stockist = await db.models.stockist_master.findByPk(stockistId);
      if (!stockist)
        return res
          .status(404)
          .json({ success: false, message: "stockist not found" });
      res.json({ success: true, data: stockist });
    } catch (error) {
      console.error("Error fetching stockist:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const UpdateStockist = async (req, res) => {
    try {
      const stockistId = req.params.StockistID;
      const stockistData = req.body;
      if (!stockistData || Object.keys(stockistData).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No data provided to update" });
      }
      const updatedStockist = await db.models.stockist_master.update(stockistData, {
        where: { stockist_id: stockistId },
      });
      if (updatedStockist[0] === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Stockist not found" });
      }
      res.json({
        success: true,
        message: "Stockist updated successfully",
        updatedStockist: stockistData,
      });
    } catch (error) {
      console.error("Error updating Stockist:", error);
      res.status(500).json({ success: false, message: "Server error " });
    }
  };


  const createStockists = async (req, res) => {
    const { companyID } = req.params;
    const stockistData = {
      ...req.body,
      stockist_key: crypto.randomBytes(16).toString('hex'),
      company_id: companyID || "",
    };
  
    try {
      const newStockists = await db.models.stockist_master.create(stockistData);
      const updatedData = await db.models.stockist_master.findAll();
      req.io.emit("updateData", updatedData);
      res.json(newStockists);
    } catch (error) {
      console.error("Error creating stockists:", error);
      res.status(500).json({ error: "Error creating stockists" });
    }
  };
  


  const stocstockistByCID = async (req, res) => {
    try {
      const { company_id } = req.params;
  
      const stockists = await db.models.stockist_master.findAll({
        where: { company_id, is_delete: 0 },
      });
  
      if (!stockists.length) {
        return res
          .status(404)
          .json({ success: false, message: "No stockists found." });
      }
  
      res.json({
        success: true,
        data: stockists,
      });
    } catch (error) {
      console.error("Error fetching stockists:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching stockists",
      });
    }
  };


  const stockistList = async (req, res) => {
    try {
      const result = await myServices.list(db.models.stockist_master, null, { is_delete: 0 });
      res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const deleteById = async (req, res) => {
    const  { id } = req.params    
    console.log("i am id", id);
    const data = req.body
    const response = await myServices.update(db.models.stockist_master, id, data);
    res.status(response.success ? 200 : 400).json(response);
  }
  

  module.exports = {
    stockistList,
    createStockists,
    getstockistById,
    UpdateStockist,
    stocstockistByCID,
    deleteById
  };
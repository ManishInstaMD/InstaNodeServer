const myServices = require('../services/myServices');
const db = require('../config/database');

// Create
exports.createProduct = async (req, res) => {
  const result = await myServices.create(db.models.product_table, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// Read
exports.getProductById = async (req, res) => {
  const result = await myServices.read(db.models.product_table, req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// Update
exports.updateProduct = async (req, res) => {
  const result = await myServices.update(db.models.product_table, req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// Delete
exports.deleteProduct = async (req, res) => {
  const result = await myServices.delete(db.models.product_table, req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

// List
exports.listProducts = async (req, res) => {
  const result = await myServices.list(db.models.product_table);
  res.status(result.success ? 200 : 400).json(result);
};

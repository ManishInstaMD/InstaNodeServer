const myServices = require("../services/myServices");
const db = require("../config/database");

//  Create a new record
const createGeneric = async (req, res) => {
  const genericData = req.body;
  const response = await myServices.create(
    db.models.master_brand_generic,
    genericData
  );
  res.status(response.success ? 201 : 500).json(response);
};

//  Get a record by ID
// const getRecordById = async (req, res) => {
//   const { generic_id } = req.params;
//   const response = await myServices.read(
//     db.models.master_brand_generic,
//     generic_id
//   );
//   res.status(response.success ? 200 : 404).json(response);
// };


const getRecordById = async (req, res) => {
  const { generic_id } = req.params;
  const response = await myServices.read(
    db.models.master_brand_generic,
    generic_id
  );
  res.status(response.success ? 200 : 404).json(response);
};

//  Update a record by ID
const updateRecordById = async (req, res) => {
  const { generic_id } = req.params;
  const response = await myServices.update(
    db.models.master_brand_generic,
    generic_id,
    req.body
  );
  res.status(response.success ? 200 : 404).json(response);
};
const listGenerics = async (req, res) => {
  const response = await myServices.list(db.models.master_brand_generic);
  res.status(response.success ? 200 : 500).json(response);
};

module.exports = {
  createGeneric,
  getRecordById,
  listGenerics,
  updateRecordById,
};

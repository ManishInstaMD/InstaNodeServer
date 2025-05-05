const myServices = require("../services/myServices");
const db = require("../config/database");
exports.getAllEstimates = async (req, res) => {
  const { company_id } = req.params;
  try {
    const result = await myServices.list(
      db.models.company_estimate,
      null, 
      {company_id, is_delete: 0 } 
    );

    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching estimates.',
      error: error.message
    });
  }
};

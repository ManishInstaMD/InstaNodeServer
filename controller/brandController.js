const myServices = require("../services/myServices");
const db = require("../config/database");

const createBrand = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Brand data is required." });
    }

    const company_id = data.company_id;
    if (!company_id) {
      return res
        .status(400)
        .json({ success: false, message: "Company ID is required." });
    }

    // Fetch division_id from master_company_division
    const division = await db.models.master_company_division.findOne({
      where: { company_id, is_delete: 0 },
    });
    console.log(division);

    if (!division) {
      return res.status(404).json({
        success: false,
        message: "No active division found for the given company.",
      });
    }

    // Set the division_id in the brand data
    data.division_id = division.division_id;

    // Proceed with brand creation
    const response = await myServices.create(
      db.models.master_brand_group,
      data
    );

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Error creating brand:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// List all records
const listBrands = async (req, res) => {
  const { limit, offset } = req.query;
  const result = await myServices.list(
    db.models.master_brand_group,
    null,
    { is_delete: 0 },
    parseInt(limit) || 10,
    parseInt(offset) || 0
  );
  return res.status(result.success ? 200 : 400).json(result);
};
const getBrandById = async (req, res) => {
  const { bg_id } = req.params;
  // console.log("bg_id", bg_id);

  const response = await myServices.read(db.models.master_brand_group, bg_id);

  if (response.success) {
    return res.status(200).json(response);
  } else {
    return res.status(404).json(response);
  }
};

// PUT /api/pmts/:id
const updateBrandById = async (req, res) => {
  const { bg_id } = req.params;
  const data = req.body;
console.log("bg_id", bg_id);

  const response = await myServices.update(
    db.models.master_brand_group,
    bg_id,
    data
  );

  if (response.success) {
    return res.status(200).json(response);
  } else {
    return res.status(400).json(response);
  }
};



const getAllBrandsByCompany = async (req, res) => {
  try {
    const { company_id } = req.params;

    if (!company_id) {
      return res.status(400).json({ error: "Company ID is required" });
    }

    const brands = await db.models.master_brand_group.findAll({
      where: { company_id, is_delete: 0 },
      attributes: [
        "bg_id",
        "name",
        "company_id",
        "division_id",
        "division_name",
        "create_date",
        "company_name",
        "category",
        "molecule",
        "is_active",
      ],
    });

    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updateIsdelete = async (req, res) => {
  try {
    const { bg_id } = req.params;
    console.log("bg_id", bg_id);
    
    const data = req.body;
    const response = await myServices.update(
      db.models.master_brand_group,
      bg_id,
      data
    );
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error updating is_delete:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


module.exports = { createBrand, listBrands, getBrandById, updateBrandById, getAllBrandsByCompany,updateIsdelete };

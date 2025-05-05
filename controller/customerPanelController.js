const master_company = require("../models/master_company");
const pmt_master = require("../models/pmt_master");
const master_brand_group = require("../models/master_brand_group");
const stockist_master = require("../models/stockist_master");
const master_company_division = require("../models/master_company_division");
const company_estimate = require("../models/company_estimate");
const pob = require("../models/pob");

const crypto = require("crypto");

const getCompanyData = async (req, res) => {
  try {
    const companies = await master_company.findAll({
      where: { is_delete: 0 },
      attributes: [
        "company_id",
        "company_name",
        "company_code",
        "total_divisions",
        "total_pmts",
        "company_email",
        "is_active",
      ],
    });
    res.json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const addCompany = async (req, res) => {
  try {
    const companyData = req.body;
    const hash = crypto
      .createHash("sha256")
      .update(companyData.company_name)
      .digest("hex");
    companyData.company_key = hash;
    const newCompany = await master_company.create(companyData);
    res.json({
      success: true,
      message: "Company added successfully",
      company_id: newCompany.company_id,
    });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getPMTList = async (req, res) => {
  try {
    const pmts = await pmt_master.findAll({
      attributes: [
        "pmt_id",
        "pmt_name",
        "company_name",
        "designation",
        "division_name",
        "mobile_number",
        "company_email",
        "create_date",
        "is_active",
      ],
    });

    res.json({ success: true, data: pmts });
  } catch (error) {
    console.error("Error fetching PMT data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await master_company.findOne({
      where: { company_id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const DivisionByCompanyId = async (req, res) => {
  try {
    const { company_id } = req.params;
    const divisions = await master_company_division.findAll({
      where: { company_id, is_delete: 0 },
    });

    if (divisions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No divisions found for this company.",
      });
    }
    res.status(200).json({ success: true, data: divisions });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const AllDivision = async (req, res) => {
  try {
    const divisions = await master_company_division.findAll(
      {
        where: { is_delete: 0 },
      }
    );
    if (divisions.length === 0) {
      return res
        .status(404)
        .json({ message: "No divisions found for this company." });
    }
    res.status(200).json({ success: true, data: divisions });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getPMTListByCompany = async (req, res) => {
  const { company_id } = req.params;
  try {
    const pmts = await pmt_master.findAll({
      where: { company_id, is_delete: 0 },
      attributes: [
        "pmt_id",
        "pmt_name",
        "company_name",
        "designation",
        "division_name",
        "mobile_number",
        "company_email",
        "create_date",
        "is_active",
      ],
    });
    res.json({ success: true, data: pmts });
  } catch (error) {
    console.error("Error fetching PMT data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




const getPobByCID = async (req, res) => {
  const { company_id } = req.params;

  try {
    const pobs = await pob.findAll({ where: { company_id, is_delete: 0 } });
    if (!pobs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No pobs found." });
    }
    res.json({ success: true, data: pobs });
  } catch (error) {
    console.error("Error fetching POBs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPmtById = async (req, res) => {
  try {
    const { pmtId } = req.params;
    const pmt = await pmt_master.findByPk(pmtId);
    if (!pmt)
      return res.status(404).json({ success: false, message: "PMT not found" });
    res.json({ success: true, data: pmt });
  } catch (error) {
    console.error("Error fetching PMT:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPobyId = async (req, res) => {
  try {
    const { pobId } = req.params;
    const pobData = await pob.findByPk(pobId);
    if (!pobData)
      return res.status(404).json({ success: false, message: "pob not found" });
    res.json({ success: true, data: pobData });
  } catch (error) {
    console.error("Error fetching pob:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDivisionById = async (req, res) => {
  try {
    const DivisionId = req.params.divisionId;
    const divisionData = await master_company_division.findByPk(DivisionId);
    if (!divisionData)
      return res
        .status(404)
        .json({ success: false, message: "division not found" });
    res.json({ success: true, data: divisionData });
  } catch (error) {
    console.error("Error fetching division:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





const getdivisionById = async (req, res) => {
  try {
    const { divisionId } = req.params;
    const division = await master_company_division.findByPk(divisionId);
    if (!division)
      return res
        .status(404)
        .json({ success: false, message: "division not found" });
    res.json({ success: true, data: division });
  } catch (error) {
    console.error("Error fetching division:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updatepmt = async (req, res) => {
  try {
    const { pmtId } = req.params;
    const pmtData = req.body;

    if (!pmtData || Object.keys(pmtData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided to update" });
    }

    const updatedPMT = await pmt_master.update(pmtData, {
      where: { pmt_id: pmtId },
    });

    if (updatedPMT[0] === 0) {
      return res.status(404).json({ success: false, message: "PMT not found" });
    }

    res.json({
      success: true,
      message: "PMT updated successfully",
      updatedPMT: pmtData,
    });
  } catch (error) {
    console.log("Error updating PMT:", error);
    res.status(500).json({ success: false, message: "Server error",error:er });
  }
};

const updatepob = async (req, res) => {
  try {
    const pobId = req.params.pobID;
    const pobData = req.body;
    if (!pobData || Object.keys(pobData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided to update" });
    }

    const updatedpob = await pob.update(pobData, {
      where: { pobid: pobId },
    });

    if (updatedpob[0] === 0) {
      return res.status(404).json({ success: false, message: "pob not found" });
    }

    res.json({
      success: true,
      message: "pob updated successfully",
      updatedpob: pobData,
    });
  } catch (error) {
    console.error("Error updating pob:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateDivisions = async (req, res) => {
  try {
    const divisionId = req.params;

    const divisionData = req.body;

    if (!divisionData || Object.keys(divisionData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided to update" });
    }
    const updatedDivision = await master_company_division.update(divisionData, {
      where: { division_id: divisionId.DivisionsID },
    });
    if (updatedDivision[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Division not found" });
    }
    res.json({
      success: true,
      message: "Division updated successfully",
      updatedDivision: divisionData,
    });
  } catch (error) {
    console.error("Error updating division:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





const getAllEstimates = async (req, res) => {
  const { company_id } = req.params;

  try {
    const estimates = await company_estimate.findAll({
      where: { company_id, is_delete: 0 },
    });
    res.json({ success: true, data: estimates });
  } catch (error) {
    console.error("Error fetching estimates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single estimate by ID
const getEstimateById = async (req, res) => {
  try {
    const estimate = await company_estimate.findOne({
      where: { estimate_id: req.params.id, is_delete: 0 },
    });
    if (!estimate) {
      return res
        .status(404)
        .json({ success: false, message: "Estimate not found" });
    }
    res.json({ success: true, data: estimate });
  } catch (error) {
    console.error("Error fetching estimate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new estimate
const createEstimate = async (req, res) => {
  try {
    const newEstimate = await company_estimate.create(req.body);
    res.status(201).json({ success: true, data: newEstimate });
  } catch (error) {
    console.error("Error creating estimate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update an estimate
const updateEstimate = async (req, res) => {
  try {
    const { id } = req.params;
    const estimate = await company_estimate.findByPk(id);
    if (!estimate || estimate.is_delete === 1) {
      return res
        .status(404)
        .json({ success: false, message: "Estimate not found" });
    }
    await estimate.update(req.body);
    res.json({ success: true, message: "Estimate updated successfully" });
  } catch (error) {
    console.error("Error updating estimate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const createPMT = async (req, res) => {
  const company_id = req.params.company_id;
  const pmtData = {
    ...req.body,
    company_id,
  };
  try {
    const newPMT = await pmt_master.create(pmtData);

    // Emit real-time update
    const updatedData = await pmt_master.findAll({ where: { company_id } });
    req.io.emit("updateData", updatedData);

    res.json(newPMT);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating PMT" });
  }
};

const createDivisions = async (req, res) => {
  const DivisionsData = {
    ...req.body,
    company_id: req.params.Company_id,
  };
  try {
    const newDivisions = await master_company_division.create(DivisionsData);
    const updatedData = await master_company_division.findAll();
    req.io.emit("updateData", updatedData);
    res.json({
      success: true,
      message: "Division created successfully",
      data: newDivisions,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      success: false,
      message: "Error creating Division",
      error: error.message,
    });
  }
};


const createpob = async (req, res) => {
  const pobData = req.body;

  const { companyID } = req.params;
  if (companyID) {
    pobData.company_id = companyID;
  }
  if (!pobData.create_date) {
    pobData.create_date = new Date();
  }
  try {
    const newpob = await pob.create(pobData);
    const updatedData = await pob.findAll();
    req.io.emit("updateData", updatedData);
    res.json(newpob);
  } catch (error) {
    console.error("Error creating pob:", error);
    res.status(500).json({ error: "Error creating pob" });
  }
};


module.exports = {
  getCompanyData,
  getPMTList,
  addCompany,
  getCompanyById,
  DivisionByCompanyId,
  getPMTListByCompany,
  getPobByCID,
  AllDivision,
  getPmtById,
  updatepmt,
  getAllEstimates,
  createPMT,
  createDivisions,
  createpob,
  updateDivisions,
  getdivisionById,
  updatepob,
  getPobyId,
  getDivisionById,
};

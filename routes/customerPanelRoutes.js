const express = require("express");
const {
  getCompanyData,
  getPMTList,
  addCompany,
  getCompanyById,
  DivisionByCompanyId,
  getPMTListByCompany,
  getPobByCID,
  AllDivision,
  updatepmt,
  getPmtById,
  getAllEstimates,
  createPMT,
  createDivisions,
  createpob,
  updateDivisions,
  getdivisionById,
  updatepob,
  getPobyId,
  getDivisionById,
} = require("../controller/customerPanelController");

const router = express.Router();
router.get("/companies", getCompanyData);
router.get("/pmts", getPMTList);
router.post("/addCompany", addCompany);
router.get("/company/:companyId", getCompanyById);
router.get("/divisions/:company_id", DivisionByCompanyId);
router.get("/pmts/:company_id", getPMTListByCompany); 
router.get("/pob/:company_id", getPobByCID);
router.get("/divisions", AllDivision);
router.put("/pmt/:pmtId", updatepmt);
router.get("/pmt/:pmtId", getPmtById);
router.get("/pobGet/:pobId", getPobyId);
router.get("/divisinSingaGet/:divisionId", getDivisionById);
router.get("/estimates/:company_id", getAllEstimates);
router.post("/createpmt/:company_id", createPMT);
router.post("/createDivision/:Company_id", createDivisions);
router.put("/divisions/:DivisionsID", updateDivisions);
router.get("/division/:divisonId", getdivisionById);
router.put("/pobUpdate/:pobID", updatepob);
router.post("/pobCreate/:companyID", createpob);

module.exports = router;

const express = require("express");
const controller = require("../controller/estimatesController");

const router = express.Router();

router.get("/estimates/:company_id", controller.getAllEstimates);
module.exports = router;

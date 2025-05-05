const express = require("express");
const router = express.Router();
const DoctorController = require("../controller/doctorController");

router.post("/newdoctor", DoctorController.create);
router.get("/doctorsList", DoctorController.findAll);
router.get("/doctor/:id", DoctorController.findById);
router.put("/doctor/:id", DoctorController.updateById);
router.post("/doctor/:id", DoctorController.deleteById);

module.exports = router;

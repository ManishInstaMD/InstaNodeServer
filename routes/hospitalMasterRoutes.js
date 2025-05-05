const express = require("express");
const router = express.Router();
const controller = require("../controller/hospitalMasterController");

router.get("/hospitalsList", controller.list);
router.post("/newhospital", controller.create);
router.get("/hospital/:id", controller.getById);
router.put("/hospital/:id", controller.update);
router.post("/hospital/delete/:id", controller.deleteById); 

module.exports = router;

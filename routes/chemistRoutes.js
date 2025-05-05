const express = require("express");
const router = express.Router();
const controller = require("../controller/chemistController");

router.get("/chemistList", controller.list);
router.post("/newChemist", controller.create);
router.get("/chemist/:id", controller.getById);
router.put("/chemist/:id", controller.update);
router.post("/chemist/:id", controller.deleteById); 

module.exports = router;

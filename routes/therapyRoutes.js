const express = require("express");
const router = express.Router();
const therapyController = require("../controller/therapyController");

router.post("/newTherapy", therapyController.create);
router.get("/therapyList", therapyController.findAll);
router.get("/therapy/:id", therapyController.findById);
router.put("/therapy/:id", therapyController.updateById);
router.post("/therapy/:id", therapyController.deleteById);

module.exports = router;

const express = require("express");
const {listGenerics,getRecordById,updateRecordById,createGeneric} = require("../controller/genericController");


const router = express.Router();

router.post("/generic", createGeneric);

router.get("/generics", listGenerics);

router.get("/generic/:generic_id", getRecordById);

router.put("/generic/:generic_id", updateRecordById);

module.exports = router;

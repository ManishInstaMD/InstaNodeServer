const express = require("express");
const {listBrands, getBrandById, updateBrandById,createBrand,getAllBrandsByCompany,updateIsdelete} = require("../controller/brandController");


const router = express.Router();

router.post('/create', createBrand);

router.get("/brandslist", listBrands);

router.get('/brand/:bg_id', getBrandById);

router.put('/brand/:bg_id', updateBrandById);

router.get("/brands/:company_id", getAllBrandsByCompany);

router.post('/deleteBrand/:bg_id', updateIsdelete);

module.exports = router;

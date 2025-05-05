// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/', productController.createProduct);
router.get('/product/:company_id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/listProducts', productController.listProducts);

module.exports = router;

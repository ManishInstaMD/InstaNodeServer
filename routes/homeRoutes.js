const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');

router.get('/totals', homeController.totals);
router.get('/summary', homeController.summary);


module.exports = router;
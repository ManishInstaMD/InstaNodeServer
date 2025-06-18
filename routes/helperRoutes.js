const express = require('express');
const router = express.Router();
const { getId } = require('../controller/helperController');

router.post("/queue", getId);

module.exports = router;
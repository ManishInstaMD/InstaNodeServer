const express = require('express');
const router = express.Router();
const followUpController = require('../controller/followupController');


router.post('/createFollowUp', followUpController.create);


router.get('/followup/:id', followUpController.getById);


router.put('/followup/:id', followUpController.updateById);


router.post('/followup/:id', followUpController.deleteFollowups);


router.get('/followupList', followUpController.list);

module.exports = router;

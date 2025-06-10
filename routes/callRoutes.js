const express = require('express');
const router = express.Router();
const callController = require('../controller/callController');

// Create a new call for a PMT
router.post('/calls', callController.createCall);

// List all calls for a PMT
router.get('/:pmt_id', callController.listCalls);

// Get a single call by ID
router.get('/call/:id', callController.getCall);

// Update a call by ID
router.put('/call/:id', callController.updateCall);

// Soft delete a call by ID
router.delete('/call/:id', callController.deleteCall);

router.get('/calls/all', callController.listAllCalls);

module.exports = router;

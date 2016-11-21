var express = require('express');
var controller = require('./stats.controller');
var router = express.Router();

router.get('/topSpeciesByOccurrence', controller.topSpeciesByOccurrence);
router.get('/topSpeciesByNumber', controller.topSpeciesByNumber);
router.get('/topSpeciesByUser', controller.topSpeciesByUser);

module.exports = router;

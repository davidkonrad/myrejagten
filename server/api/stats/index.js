var express = require('express');
var controller = require('./stats.controller');
var ratio = require('./ratio.controller');
var arter = require('./arter.controller');
var router = express.Router();

router.get('/topSpeciesByOccurrence', controller.topSpeciesByOccurrence);
router.get('/topSpeciesByNumber', controller.topSpeciesByNumber);
router.get('/topSpeciesByUser', controller.topSpeciesByUser);

router.get('/ratioGetTotal', ratio.getTotal);
router.get('/ratioGetTotalUser', ratio.getTotalUser);
router.get('/ratioGetEksperiment', ratio.getEksperiment);

router.get('/arterGetTotal', arter.getTotal);

module.exports = router;

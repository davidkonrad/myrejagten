var express = require('express');
var controller = require('./download.controller');
var log = require('./log.controller');
var models = require('../mysql');
var router = express.Router();

router.get('/all', controller.all);
router.get('/gbif', controller.gbif);
router.get('/data/:id', controller.data);

router.post('/log', log.logExport);

module.exports = router;

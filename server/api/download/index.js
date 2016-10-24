var express = require('express');
var controller = require('./download.controller');
var models = require('../mysql');
var router = express.Router();

router.get('/all', controller.all);
router.get('/gbif', controller.gbif);
router.get('/data/:id', controller.data);

module.exports = router;

var express = require('express');
var controller = require('./download.controller');
var config = require('../../config/environment');
var models = require('../mysql');
var router = express.Router();

router.get('/gbif', controller.gbif);

module.exports = router;

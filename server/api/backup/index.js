'use strict';

var express = require('express');
var controller = require('./backup.controller');

var router = express.Router();
router.get('/getCreateTable/:table', controller.getCreateTable);
router.get('/getTableSQL/:table', controller.getTableSQL);

module.exports = router;


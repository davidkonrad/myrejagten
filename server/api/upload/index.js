var express = require('express');
var multer  = require('multer');
var controller = require('./upload.controller');
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var router = express.Router();

router.post('/', [ multer({ dest: uploadDir }), controller.getFile]);

module.exports = router;

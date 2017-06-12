var express = require('express');
var multer = require('multer');
var controller = require('./upload.controller');
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var cacheDir = config.cacheDir;
var router = express.Router();

router.post('/image', [ multer({ dest: uploadDir }), controller.getFile]);
router.get('/remove/:fileName', controller.removeFile);
router.post('/cache', [ multer({ dest: cacheDir }), controller.getFileCache]);
router.get('/removeCache/:fileName', controller.removeFileCache);

module.exports = router;

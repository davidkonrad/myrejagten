'use strict';

var express = require('express');
var controller = require('./eksperiment.controller');

var router = express.Router();
router.get('/fields/', controller.describe);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

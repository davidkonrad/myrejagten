var express = require('express');
var controller = require('./email.controller');
var router = express.Router();

router.post('/signup', controller.signupMail );
router.post('/glemtPassword', controller.glemtPassword );

module.exports = router;

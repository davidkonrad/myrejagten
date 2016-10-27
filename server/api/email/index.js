var express = require('express');
var controller = require('./email.controller');
var router = express.Router();

router.post('/signup', controller.signupMail );
router.post('/glemtPassword', controller.glemtPassword );

router.post('/test', controller.test );


module.exports = router;

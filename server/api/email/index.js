var express = require('express');
var controller = require('./email.controller');

var router = express.Router();

router.post('/', controller.send );
router.post('/signup', controller.signupMail );

module.exports = router;

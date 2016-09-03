var nodemailer = require('nodemailer');
var email   = require("emailjs");


/*
var transporter = nodemailer.createTransport({
  service: 'localhost',
  debug: true,
  auth: false,
  tls: {
		rejectUnauthorized: false
  }
});
*/

/*
var transporter = nodemailer.createTransport({
	service: "Gmail",
	secureConnection: true,
	auth: {
		user: "davidkonrad@gmail.com",
		pass: "3chol%0Ma"
	}
});
*/

/*
transporter.verify(function(error, success) {
   if (error) {
        console.log('XXX', error);
   } else {
        console.log('Server is ready to take our messages');
   }
});
*/

exports.signupMail = function(req,res){
	console.log('SignupMail SENDING')

/*
	var server  = email.server.connect({
		user: (new Buffer("davidkonrad")).toString("base64"),
		password: (new Buffer("dadk")).toString("base64"),
		host: "localhost", 
		//ssl: false,
		port : 25,
		//tls : false
	});

	server.send({
		text:  'qwerty', 
		from:   'test@test.dk', 
		to:   'david.konrad@snm.ku.dk',
		subject: 'TEST'
	 }, function(err, message) {
		console.log(err)
		console.log(message)
		//callback(err);
	});
*/

/*
  var mailOptions = {
    to: 'david.konrad@snm.ku.dk',
    subject: 'Tilmelding tli Myrejagten',
    from: 'davidkonrad@gmail.com', //req.data.from,
		text: 'QWERTYYYYYYYYYYY',
    html: 'hello' //req.data.body
  };
  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
    }else{
      console.log('Message sent: ' + info.response);
    }
  });
*/

var transporter = nodemailer.createTransport({
  service: 'localhost',
  debug: true,
  auth: false,
  tls: {
		rejectUnauthorized: false
  }
});
  var mailOptions = {
    to: 'migselv <davidkonrad@gmail.com>',
    subject: 'Tilmelding tli Myrejagten',
    from: 'noreply <david.konrad@snm.ku.dk>', //req.data.from,
		text: 'dette er en prøve',
    html: 'hej med dig' //req.data.body
  };
  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
    }else{
      console.log('Message sent: ' + info.response);
    }
  });



}

exports.send = function(req,res){
	console.log('SENDING')
  var mailOptions = {
    to: 'qwerty',
    subject: 'New request on lumbajack from ',
    from: req.data.from,
    html: req.data.body
  };
  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
    }else{
      console.log('Message sent: ' + info.response);
    }
  });
}

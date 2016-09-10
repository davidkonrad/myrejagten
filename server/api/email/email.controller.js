var nodemailer = require('nodemailer');
//var email   = require("emailjs");


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

var server = 'a00592.science.ku.dk/'

exports.signupMail = function(req, res){
	console.log('SignupMail SENDING')
	console.log(req.body)
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

	var msg = 'Hej ' + req.body.name + ', ' + "\n\n"
	msg += 'Tak for din tilmelding til Myrejagten. For at verificere din emailadresse bedes du klikke på nedenstående link : ' + "\n\n"
	msg += server + 'bekræft/' + req.body.code	+ "\n\n"
	msg += 'Ved at klikke på linket afsluttes oprettelsesproceduren, og du videresendes til din startside. ' + "\n\n"
	msg += 'Venlig hilsen Myrejagten og Statens Naturhistoriske Museum.' 

  var mailOptions = {
    to: 'migselv <davidkonrad@gmail.com>',
    subject: 'Tilmelding tli Myrejagten',
    from: 'noreply <myrejagten@snm.ku.dk>', 
		text: msg
    //html: '<h2>Tilmelding til myrejagten</h2>' 
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

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var models = require('../mysql');
var server = 'http://myrejagten.snm.ku.dk/';

var signature = 'Med venlig hilsen' + "\n" + 'Myrejagten og Statens Naturhistoriske Museum.';


exports.test = function(req, res){
	var transporter = nodemailer.createTransport({
		host: "exchange.ku.dk", // hostname
		secureConnection: false,
    secure: false,
		requireTLS: false,
    port: 465, 
    auth: {
			//user: "FUNK-SCI-SNM-myrejagten@ku.dk"
			user: "myrejagten@snm.ku.dk",
			password: "dadkKU16sep"
    }
	})

		  var mailOptions = {
		    to: 'migslv <david.konrad @snm.ku.dk>',
		    subject: 'Myrejagten, test',
		    from: 'noreply <myrejagten@snm.ku.dk>', 
				text: 'hello'
		  };

		 transporter.sendMail(mailOptions, function(err, info) {
		    if (err) {
		      console.log(err);
					return res.json(200, 'Fejl ved afsendelse af mail :'+ err +'.');
		    } else {
		      console.log('Message sent: ' + info.response);
					return res.json(200, 'Mail sendt til '+ email +'.');
		    }

		})
}

function getTransporter() {
	/*
	return transporter = nodemailer.createTransport({
	  service: 'localhost',
	  debug: true,
	  auth: false,
	  tls: {
			rejectUnauthorized: false
	  }
	});
	*/

	/*
	return transporter = nodemailer.createTransport({
		host: "SMTP.P0KITCASARRAY01.UNICPH.DOMAIN",
		port: 25,
	  auth: 
		{
			user : 'myrejagten@snm.ku.dk'
		},
	  tls: {
			rejectUnauthorized: false
	  }
	});
------------------------------------------------------
	*/

	return transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
       user: "myrejagten@gmail.com",
       pass: "Kelager%666"
		}
	})
}

exports.signupMail = function(req, res){
	var user_id = req.body.id ? req.body.id : null;
	var transporter = getTransporter();

	if (user_id) {
		var sql = 'select * from user where user_id='+user_id;
		models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(user) {
			user = user[0] ? user[0] : null;
			if (!user) {
				return res.json(200, { error: 'Bruger eksisterer ikke.' });
			}

			var msg = 'Hej ' + user.brugernavn + ', ' + "\n\n\n";
			msg += 'Tak for din tilmelding til Myrejagten. For at verificere din emailadresse bedes du klikke på nedenstående link : ' + "\n\n";
			msg += server + 'bekræft-email/#' + user.hash + "\n\n";
			msg += 'Ved at klikke på linket afsluttes oprettelsesproceduren, og du videresendes til myrejagtens forside. ' + "\n\n";
			msg += signature;

			console.log(msg)

		  var mailOptions = {
		    to: '"'+user.brugernavn+'"' + '<' + user.email + '>',
		    subject: 'Tilmelding til Myrejagten',
				replyTo: '"Tilmelding" <myrejagten@snm.ku.dk>',
		    from: 'myrejagten@snm.ku.dk', 
				priority: 'high',
				headers: {
					'X-Mailer': 'nodemailer' 
				},
				text: msg
		  };

		  return transporter.sendMail(mailOptions, function(err, info) {
		    if (err) {
		      console.log(err);
					return res.json(200, { error: err });
		    } else {
					var msg = 'Der er sendt en bekræftelses-mail til ' + user.email + '. ';
					msg += 'I denne mail er der et link du skal klikke på for at få emailadressen bekræftet. ';
					msg += 'Når dette er gjort kan du logge ind på myrejagten med email-adressen og det valgte password. ';
					return res.json(200, { ok: msg });
		      console.log('Message sent: ' + info.response);
		    }
		  });
		})
	}
}


exports.glemtPassword = function(req,res){
	var email = req.body.email ? req.body.email : null;
	var transporter = getTransporter();

	if (email) {
		var sql = 'select * from user where email="'+email+'"';
		models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(user) {
			user = user[0] ? user[0] : null;
			if (!user) {
				return res.json(200, email+' er ikke tilknyttet nogen konto på Myrejagten.');
			}

			var msg = 'Hej ' + user.brugernavn + ', ' + "\n\n\n";
			msg += 'Du har anmodet om at få gensendt dit password. ';
			msg += 'Dine login-oplysninger på myrejagten er : '+ "\n\n";
			msg += 'email: '+user.email + "\n";
			msg += 'password: '+user.password + "\n";
			msg += "\n\n";
			msg += signature;

			console.log(msg)

		  var mailOptions = {
		    to: user.brugernavn + '<' + user.email + '>',
		    subject: 'Myrejagten, glemt password',
		    from: 'noreply <myrejagten@snm.ku.dk>', 
				text: msg
		  };

		  return transporter.sendMail(mailOptions, function(err, info) {
		    if (err) {
		      console.log(err);
					return res.json(200, 'Fejl ved afsendelse af mail :'+ err +'.');
		    } else {
		      console.log('Message sent: ' + info.response);
					return res.json(200, 'Mail sendt til '+ email +'.');
		    }
		  });
		})
	}
}



var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var models = require('../mysql');
var server = 'http://myrejagten.snm.ku.dk/';

var signature = 'Med venlig hilsen' + "\n" + 'Myrejagten og Statens Naturhistoriske Museum.';

function getTransporter(test) {
	if (test) {
		return nodemailer.createTransport({
			service: "Gmail",
			auth: {
	       user: "myrejagten@gmail.com",
	       pass: "Kelager%666"
			}
		})
	}
	return nodemailer.createTransport({
		host: 'Exchange.ku.dk',
		secureConnection: false,
    secure: false,
		requireTLS: true,
    port: 465, 
    auth: {
			user: 'FUNK-SCI-SNM-myrejagten@ku.dk',
			pass: 'Alexander26_20'
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
			msg += 'Tak for at oprette dig som bruger i Myrejagten. Du skal godkende din emailadresse ved at klikke på nedenstående link. ' + "\n\n";
			msg += server + 'bekræft-email/#' + user.hash + "\n\n";
			msg += 'Ved at klikke på linket afsluttes oprettelsesproceduren, og du videresendes til myrejagtens forside. ' + "\n\n";
			msg += signature;

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
					return res.json(200, { error: err });
		    } else {
					var msg = 'Der er sendt en bekræftelses-mail til ' + user.email + '. ';
					msg += 'I denne mail er der et link du skal klikke på for at få emailadressen bekræftet. ';
					msg += 'Når dette er gjort kan du logge ind på myrejagten med email-adressen og det valgte password. ';
					return res.json(200, { ok: msg });
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

		  var mailOptions = {
		    to: user.brugernavn + '<' + user.email + '>',
		    subject: 'Myrejagten, glemt password',
		    from: 'noreply <myrejagten@snm.ku.dk>', 
				text: msg
		  };

		  return transporter.sendMail(mailOptions, function(err, info) {
		    if (err) {
					return res.json(200, 'Fejl ved afsendelse af mail :'+ err +'.');
		    } else {
					return res.json(200, 'Mail sendt til '+ email +'.');
		    }
		  });
		})
	}
}

exports.raw = function(req, res) {
	//console.log(req);
	var email = req.body.email ? req.body.email : null;
	var subject = req.body.subject ? req.body.subject : null;
	var mailBody = req.body.mailBody ? req.body.mailBody : null;

	if (!email || !subject || !mailBody) res.json(200, false);

	console.log(email, subject, mailBody)

	var transporter = getTransporter();
	var mailOptions = {
		to: email,
    subject: subject,
		from: 'noreply <myrejagten@snm.ku.dk>', 
		text: mailBody
  };

  return transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
			return res.json(200, 'Fejl ved afsendelse af mail :'+ err +'.');
    } else {
			return res.json(200, 'Mail sendt til '+ email +'.');
    }
  });
}



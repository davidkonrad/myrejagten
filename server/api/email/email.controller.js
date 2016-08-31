var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xyz',
    pass: 'qwerty'
  }
});

exports.signupMail = function(req,res){
	console.log('SignupMail SENDING')
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

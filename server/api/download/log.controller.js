const fs = require('fs');
var path = process.env.NODE_ENV == 'development' ? 'client/' : '../public/';
path += 'udtraek.log';

exports.logExport = function(req, res) {
	var userName = req.body.userName;
	var userEmail = req.body.userEmail;
	var type = req.body.type;
	var fields = req.body.fields;
	var timestamp = new Date().toISOString();

	var s = timestamp + "\t" + userName + "\t" + userEmail + "\t" + type + "\t" + fields + "\n";

	fs.appendFile(path, s, function (err) {
		if (err) throw err;
		return res.json(200, s);
	});
}


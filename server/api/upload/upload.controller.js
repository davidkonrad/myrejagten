var env = process.env.NODE_ENV || "development";
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var fs = require('fs');

exports.getFile = function(req, res) {
	var filePath = req.files.file.path;
	//upload path is either client/uploads or public/uploads	
	filePath = filePath.replace(/public|client/, '');
	res.send(200, filePath);
};

exports.removeFile = function(req, res) {
	var fileName = req.params.fileName;
	//upload path is /uploads, should be replaced with uploadDir
	fileName = fileName.replace('/uploads', uploadDir);
	fs.unlink(fileName, function next(err, result) {
		if (err) {
			res.send(200, err);
		} else {
			res.send(200, result);
		}
	})
};





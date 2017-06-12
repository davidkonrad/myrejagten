var env = process.env.NODE_ENV || "development";
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var cacheDir = config.cacheDir;
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

exports.getFileCache = function(req, res) {
	var cached = req.files.file.path;
	var original = req.files.file.originalname;
	res.send(200, { cachedFileName: cached, originalFileName: original });
};

exports.removeFileCache = function(req, res) {
	var fileName = req.params.fileName;
	fs.unlink(fileName, function next(err, result) {
		if (err) {
			res.send(200, err);
		} else {
			res.send(200, result);
		}
	})
};



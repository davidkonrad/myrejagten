var env = process.env.NODE_ENV || "development";
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var _ = require('lodash');

exports.getFile = function(req, res) {
	var filePath = req.files.file.path;
	/**
		upload path is either client/uploads or public/uploads	
	*/
	filePath = filePath.replace(/public|client/, '');
	res.send(200, filePath);
};



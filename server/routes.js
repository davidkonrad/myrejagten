/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

	app.use('/api/projekt', require('./api/mysql/projekt'));
	app.use('/api/eksperiment', require('./api/mysql/eksperiment'));
	app.use('/api/data', require('./api/mysql/data'));
	app.use('/api/mysqluser', require('./api/mysql/user'));

  app.use('/api/email', require('./api/email'));
  app.use('/api/upload', require('./api/upload'));
  app.use('/api/download', require('./api/download'));

	// All undefined asset or api routes should return a 404
	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
		.get(errors[404]);

	// All other routes should redirect to the index.html
	app.route('/*')
		.get(function(req, res) {
			res.sendfile(app.get('appPath') + '/index.html');
		});

};

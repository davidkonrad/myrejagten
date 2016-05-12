/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

	app.use('/api/booking', require('./api/mysql/booking'));
	app.use('/api/klasse', require('./api/mysql/klasse'));
	app.use('/api/klassetrin', require('./api/mysql/klassetrin'));
	app.use('/api/fag', require('./api/mysql/fag'));
	app.use('/api/taxon', require('./api/mysql/taxon'));
	app.use('/api/booking_taxon', require('./api/mysql/booking_taxon'));
	app.use('/api/proeve', require('./api/mysql/proeve'));
	app.use('/api/lokalitet', require('./api/mysql/lokalitet'));
	app.use('/api/resultat', require('./api/mysql/resultat'));
	app.use('/api/resultat_item', require('./api/mysql/resultat_item'));
	app.use('/api/kommentar', require('./api/mysql/kommentar'));

	//MongoDB
	app.use('/api/users', require('./api/mongo/user'));
	app.use('/auth', require('./auth'));

	// All undefined asset or api routes should return a 404
	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
		.get(errors[404]);

	// All other routes should redirect to the index.html
	app.route('/*')
		.get(function(req, res) {
			res.sendfile(app.get('appPath') + '/index.html');
		});

};

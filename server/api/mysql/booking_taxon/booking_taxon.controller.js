'use strict';
var models = require('../');

// Get list of booking_taxons
exports.index = function(req, res) {
  models.Booking_taxon.findAll().then(function(booking_taxon){
  	return res.json(200, booking_taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single booking_taxon
exports.show = function(req, res) {
  models.Booking_taxon.find(req.params.id).then(function(booking_taxon){
  	return res.json(200, booking_taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new booking_taxon in the DB.
exports.create = function(req, res) {
  models.Booking_taxon.create(req.body).then(function(booking_taxon) {
    return res.json(201, booking_taxon);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing booking_taxon in the DB.
exports.update = function(req, res) {
  models.Booking_taxon.find(req.params.id).then(function(booking_taxon){
      if(!booking_taxon) { return res.send(404); }  
	  return booking_taxon.updateAttributes(req.body);	  	
  }).then(function(booking_taxon){
  	return res.json(200, booking_taxon);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a booking_taxon from the DB.
exports.destroy = function(req, res) {
	models.Booking_taxon.find(req.params.id).then(function(booking_taxon){
		if(!booking_taxon) { return res.send(404); }
		return booking_taxon.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe booking_taxon
exports.describe = function(req, res) {
  models.Booking_taxon.describe().then(function(booking_taxon){
  	return res.json(200, booking_taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

'use strict';
var models = require('../');

// Get list of bookings
exports.index = function(req, res) {
  models.Booking.findAll({ include: [{ 
		model: models.Klasse,
		as: 'Klasse'
	}]}).then(function(booking){
		return res.status(200).json(booking) 
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single booking
exports.show = function(req, res) {
  //models.Booking.find({ where : { booking_id: req.params.id }} ).then(function(booking) {
  models.Booking.find({ where : { booking_id: req.params.id }, include: [{ 
		model: models.Klasse,
		as: 'Klasse'
	}]}).then(function(booking){
  //models.Booking.find(req.params.id).then(function(booking){
  	return res.json(200, booking);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new booking in the DB.
exports.create = function(req, res) {
  models.Booking.create(req.body).then(function(booking) {
    return res.json(201, booking);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing booking in the DB.
exports.update = function(req, res) {
/*
  models.Booking.find(req.params.id).then(function(booking){
*/
  models.Booking.find({ where : { booking_id: req.params.id }} ).then(function(booking) {
		if(!booking) { return res.send(404); }  
	  return booking.updateAttributes(req.body);	  	
  }).then(function(booking){
  	return res.json(200, booking);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a booking from the DB.
exports.destroy = function(req, res) {
	models.Booking.find(req.params.id).then(function(booking){
		if(!booking) { return res.send(404); }
		return booking.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe booking
exports.describe = function(req, res) {
  models.Booking.describe().then(function(booking){
	  //console.log(booking);
  	return res.json(200, booking);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

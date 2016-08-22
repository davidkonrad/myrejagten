'use strict';
var models = require('../');


// Get list of klasses
exports.index = function(req, res) {

models.Klasse.findAll().then(function(klasse){
  	return res.json(200, klasse);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single klasse
exports.show = function(req, res) {
  models.Klasse.find(req.params.id).then(function(klasse){
  	return res.json(200, klasse);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new klasse in the DB.
exports.create = function(req, res) {
  models.Klasse.create(req.body).then(function(klasse) {
    return res.json(201, klasse);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing klasse in the DB.
exports.update = function(req, res) {
  models.Klasse.find({ where : { klasse_id: req.params.id }} ).then(function(klasse){
    if(!klasse) { return res.send(404); }  
	  return klasse.updateAttributes(req.body);	  	
  }).then(function(klasse){
  	return res.json(200, klasse);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a klasse from the DB.
exports.destroy = function(req, res) {
	models.Klasse.destroy({ where : { klasse_id: req.params.id }} ).then(function(klasse){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

// Describe klasse
exports.describe = function(req, res) {
  models.Klasse.describe().then(function(klasse){
  	return res.json(200, klasse);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

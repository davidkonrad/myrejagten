'use strict';
var models = require('../');


// Get list of eksperiments
exports.index = function(req, res) {
  models.Eksperiment.findAll().then(function(eksperiment){
  	return res.json(200, eksperiment);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single eksperiment
exports.show = function(req, res) {
  models.Eksperiment.find(req.params.id).then(function(eksperiment){
  	return res.json(200, eksperiment);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new eksperiment in the DB.
exports.create = function(req, res) {
  models.Eksperiment.create(req.body).then(function(eksperiment) {
    return res.json(201, eksperiment);
  }).catch(function(err){
	  handleError(res, err);
  });
};



// Updates an existing eksperiment in the DB.
exports.update = function(req, res) {
  models.Eksperiment.find({ where : { eksperiment_id: req.params.id }} ).then(function(eksperiment) {
    if (!eksperiment) { 
			return res.send(404); 
		}  
	  return eksperiment.updateAttributes(req.body);	  	
  }).then(function(eksperiment){
  	return res.json(200, eksperiment);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a eksperiment from the DB.
exports.destroy = function(req, res) {
  models.Eksperiment.destroy({ where : { eksperiment_id : req.params.id }} ).then(function(eksperiment){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};


// Describe eksperiment
exports.describe = function(req, res) {
  models.Eksperiment.describe().then(function(eksperiment){
	  console.log(eksperiment);
  	return res.json(200, eksperiment);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

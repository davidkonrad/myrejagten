'use strict';
var models = require('../');


// Get list of proeves
exports.index = function(req, res) {
  models.Proeve.findAll().then(function(proeve){
  	return res.json(200, proeve);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single proeve
exports.show = function(req, res) {
  models.Proeve.find(req.params.id).then(function(proeve){
  	return res.json(200, proeve);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new proeve in the DB.
exports.create = function(req, res) {
  models.Proeve.create(req.body).then(function(proeve) {
    return res.json(201, proeve);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing proeve in the DB.
exports.update = function(req, res) {
  //models.Proeve.find(req.params.id).then(function(proeve){
  models.Proeve.find({ where : { proeve_id: req.params.id }} ).then(function(proeve){
    if(!proeve) { return res.send(404); }  
	  return proeve.updateAttributes(req.body);	  	
  }).then(function(proeve){
  	return res.json(200, proeve);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a proeve from the DB.
exports.destroy = function(req, res) {
	models.Proeve.find(req.params.id).then(function(proeve){
		if(!proeve) { return res.send(404); }
		return proeve.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe proeve
exports.describe = function(req, res) {
  models.Proeve.describe().then(function(proeve){
	  console.log(proeve);
  	return res.json(200, proeve);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

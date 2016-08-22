'use strict';
var models = require('../');


// Get list of klassetrins
exports.index = function(req, res) {

  models.Klassetrin.findAll().then(function(klassetrin){
  	return res.json(200, klassetrin);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single klassetrin
exports.show = function(req, res) {
  models.Klassetrin.find(req.params.id).then(function(klassetrin){
  	return res.json(200, klassetrin);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new klassetrin in the DB.
exports.create = function(req, res) {
  models.Klassetrin.create(req.body).then(function(klassetrin) {
    return res.json(201, klassetrin);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing klassetrin in the DB.
exports.update = function(req, res) {
  models.Klassetrin.find(req.params.id).then(function(klassetrin){
      if(!klassetrin) { return res.send(404); }  
	  return klassetrin.updateAttributes(req.body);	  	
  }).then(function(klassetrin){
  	return res.json(200, klassetrin);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a klassetrin from the DB.
exports.destroy = function(req, res) {
	
	models.Klassetrin.find(req.params.id).then(function(klassetrin){
		if(!klassetrin) { return res.send(404); }
		return klassetrin.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe klassetrin
exports.describe = function(req, res) {
  models.Klassetrin.describe().then(function(klassetrin){
	  console.log(klassetrin);
  	return res.json(200, klassetrin);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

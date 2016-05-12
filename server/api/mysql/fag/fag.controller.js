'use strict';
var models = require('../');


// Get list of fags
exports.index = function(req, res) {

  models.Fag.findAll().then(function(fag){
  	return res.json(200, fag);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single fag
exports.show = function(req, res) {
  models.Fag.find(req.params.id).then(function(fag){
  	return res.json(200, fag);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new fag in the DB.
exports.create = function(req, res) {
  models.Fag.create(req.body).then(function(fag) {
    return res.json(201, fag);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing fag in the DB.
exports.update = function(req, res) {
  models.Fag.find(req.params.id).then(function(fag){
      if(!fag) { return res.send(404); }  
	  return fag.updateAttributes(req.body);	  	
  }).then(function(fag){
  	return res.json(200, fag);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a fag from the DB.
exports.destroy = function(req, res) {
	
	models.Fag.find(req.params.id).then(function(fag){
		if(!fag) { return res.send(404); }
		return fag.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe fag
exports.describe = function(req, res) {
  models.Fag.describe().then(function(fag){
	  console.log(fag);
  	return res.json(200, fag);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

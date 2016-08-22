'use strict';
var models = require('../');


// Get list of taxons
exports.index = function(req, res) {

  models.Taxon.findAll().then(function(taxon){
  	return res.json(200, taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single taxon
exports.show = function(req, res) {
  models.Taxon.find(req.params.id).then(function(taxon){
  	return res.json(200, taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new taxon in the DB.
exports.create = function(req, res) {
  models.Taxon.create(req.body).then(function(taxon) {
    return res.json(201, taxon);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing taxon in the DB.
exports.update = function(req, res) {
  models.Taxon.find(req.params.id).then(function(taxon){
      if(!taxon) { return res.send(404); }  
	  return taxon.updateAttributes(req.body);	  	
  }).then(function(taxon){
  	return res.json(200, taxon);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	
	models.Taxon.find(req.params.id).then(function(taxon){
		if(!taxon) { return res.send(404); }
		return taxon.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe taxon
exports.describe = function(req, res) {
  models.Taxon.describe().then(function(taxon){
	  console.log(taxon);
  	return res.json(200, taxon);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of kommentar, use query if specified
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.Kommentar.findAll(query).then(function(kommentar){
  	return res.json(200, kommentar);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single kommentar
exports.show = function(req, res) {
  models.Kommentar.find(req.params.id).then(function(kommentar){
  	return res.json(200, kommentar);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new kommentar in the DB.
exports.create = function(req, res) {
  models.Kommentar.create(req.body).then(function(kommentar) {
    return res.json(201, kommentar);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing kommentar in the DB.
exports.update = function(req, res) {
  models.Kommentar.find({ where : { kommentar_id: req.params.id }} ).then(function(kommentar){
    if (!kommentar) { 
			return res.send(404); 
		}  
	  return kommentar.updateAttributes(req.body);	  	
  }).then(function(kommentar){
  	return res.json(200, kommentar);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a kommentar from the DB.
exports.destroy = function(req, res) {
  models.Kommentar.destroy({ where : { kommentar_id: req.params.id }} ).then(function(kommentar){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};


// Describe kommentar
exports.describe = function(req, res) {
  models.Kommentar.describe().then(function(kommentar){
  	return res.json(200, kommentar);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

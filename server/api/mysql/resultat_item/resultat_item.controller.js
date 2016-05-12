'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of resultat_items, use query if specified
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.Resultat_item.findAll(query).then(function(resultat_item){
  	return res.json(200, resultat_item);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single resultat_item
exports.show = function(req, res) {
  models.Resultat_item.find(req.params.id).then(function(resultat_item){
  	return res.json(200, resultat_item);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new resultat_item in the DB.
exports.create = function(req, res) {
  models.Resultat_item.create(req.body).then(function(resultat_item) {
    return res.json(201, resultat_item);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing resultat_item in the DB.
exports.update = function(req, res) {
  models.Resultat_item.find({ where : { resultat_item_id: req.params.id }} ).then(function(resultat_item){
    if (!resultat_item) { 
			return res.send(404); 
		}  
	  return resultat_item.updateAttributes(req.body);	  	
  }).then(function(resultat_item){
  	return res.json(200, resultat_item);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a resultat_item from the DB.
exports.destroy = function(req, res) {
  models.Resultat_item.destroy({ where : { resultat_item_id: req.params.id }} ).then(function(resultat_item){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

// Describe resultat_item
exports.describe = function(req, res) {
  models.Resultat_item.describe().then(function(resultat_item){
  	return res.json(200, resultat_item);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

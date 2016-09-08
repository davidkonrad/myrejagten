'use strict';
var models = require('../');


// Get list of datas
exports.index = function(req, res) {
  models.Data.findAll().then(function(data){
  	return res.json(200, data);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single data
exports.show = function(req, res) {
  models.Data.find(req.params.id).then(function(data){
  	return res.json(200, data);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new data in the DB.
exports.create = function(req, res) {
  models.Data.create(req.body).then(function(data) {
    return res.json(201, data);
  }).catch(function(err){
	  handleError(res, err);
  });
};



// Updates an existing data in the DB.
exports.update = function(req, res) {
  models.Data.find({ where : { data_id: req.params.id }} ).then(function(data) {
    if (!data) { 
			return res.send(404); 
		}  
	  return data.updateAttributes(req.body);	  	
  }).then(function(data){
  	return res.json(200, data);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a data from the DB.
exports.destroy = function(req, res) {
  models.Data.destroy({ where : { data_id : req.params.id }} ).then(function(data){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};


// Describe data
exports.describe = function(req, res) {
  models.Data.describe().then(function(data){
  	return res.json(200, data);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

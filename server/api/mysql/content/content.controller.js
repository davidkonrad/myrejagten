'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of contents, use query if specified
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.Content.findAll(query).then(function(content){
  	return res.json(200, content);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single content
exports.show = function(req, res) {
  models.Content.find(req.params.id).then(function(content){
  	return res.json(200, content);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new content in the DB.
exports.create = function(req, res) {
  models.Content.create(req.body).then(function(content) {
    return res.json(201, content);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing content in the DB.
exports.update = function(req, res) {
  models.Content.find({ where : { content_id: req.params.id }} ).then(function(content){
    if (!content) { 
			return res.send(404); 
		}  
	  return content.updateAttributes(req.body);	  	
  }).then(function(content){
  	return res.json(200, content);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a content from the DB.
exports.destroy = function(req, res) {
  models.Content.destroy({ where : { content_id: req.params.id }} ).then(function(content){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

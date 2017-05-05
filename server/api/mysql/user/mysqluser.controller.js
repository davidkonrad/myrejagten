'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of users
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.User.findAll(query).then(function(user){
  	return res.json(200, user);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single user
exports.show = function(req, res) {
  models.User.find(req.params.id).then(function(user){
  	return res.json(200, user);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  models.User.create(req.body).then(function(user) {
    return res.json(201, user);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  models.User.find({ where : { user_id: req.params.id }} ).then(function(user){
		if(!user) { return res.send(404); }  
	  return user.updateAttributes(req.body);	  	
  }).then(function(user){
  	return res.json(200, user);
  }).catch(function(err){
	  handleError(res, err);
  });
  
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
  models.User.destroy({ where : { user_id : req.params.id }} ).then(function(user) {
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

// Describe user
exports.describe = function(req, res) {
  models.User.describe().then(function(user){
  	return res.json(200, user);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

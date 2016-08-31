'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of users
exports.index = function(req, res) {
	//models.User.findAll().then(function(user){
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

/*
fffffffffffffffffffffffffffffffffffffffffffffffff
// Updates an existing klasse in the DB.
exports.update = function(req, res) {
  models.Klasse.find({ where : { klasse_id: req.params.id }} ).then(function(klasse){
    if(!klasse) { return res.send(404); }  
	  return klasse.updateAttributes(req.body);	  	
  }).then(function(klasse){
  	return res.json(200, klasse);
  }).catch(function(err){
	  handleError(res, err);
  });
};
*/

// Updates an existing user in the DB.
exports.update = function(req, res) {
  //models.User.find(req.params.id).then(function(user){
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
	
	models.User.find(req.params.id).then(function(user){
		if(!user) { return res.send(404); }
		return user.destroy()
	}).then(function(){
		return res.send(204);
	}).catch(function(err){
	  handleError(res, err);
  });
	
};

// Describe user
exports.describe = function(req, res) {
  models.User.describe().then(function(user){
	  console.log(user);
  	return res.json(200, user);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

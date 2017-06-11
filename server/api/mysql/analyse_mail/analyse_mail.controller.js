'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of analyse_mails, use query if specified
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.Analyse_mail.findAll(query).then(function(analyse_mail){
  	return res.json(200, analyse_mail);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single analyse_mail
exports.show = function(req, res) {
  models.Analyse_mail.find(req.params.id).then(function(analyse_mail){
  	return res.json(200, analyse_mail);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new analyse_mail in the DB.
exports.create = function(req, res) {
  models.Analyse_mail.create(req.body).then(function(analyse_mail) {
    return res.json(201, analyse_mail);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing analyse_mail in the DB.
exports.update = function(req, res) {
  models.Analyse_mail.find({ where : { analyse_mail_id: req.params.id }} ).then(function(analyse_mail){
    if (!analyse_mail) { 
			return res.send(404); 
		}  
	  return analyse_mail.updateAttributes(req.body);	  	
  }).then(function(analyse_mail){
  	return res.json(200, analyse_mail);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a analyse_mail from the DB.
exports.destroy = function(req, res) {
  models.Analyse_mail.destroy({ where : { analyse_mail_id: req.params.id }} ).then(function(analyse_mail){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

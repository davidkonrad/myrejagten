'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of resultats, use query if specified
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
  models.Resultat.findAll(query).then(function(resultat){
  	return res.json(200, resultat);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single resultat
exports.show = function(req, res) {
  models.Resultat.find(req.params.id).then(function(resultat){
  	return res.json(200, resultat);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new resultat in the DB.
exports.create = function(req, res) {
  models.Resultat.create(req.body).then(function(resultat) {
    return res.json(201, resultat);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing resultat in the DB.
exports.update = function(req, res) {
  models.Resultat.find({ where : { resultat_id: req.params.id }} ).then(function(resultat){
    if (!resultat) { 
			return res.send(404); 
		}  
	  return resultat.updateAttributes(req.body);	  	
  }).then(function(resultat){
  	return res.json(200, resultat);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a resultat from the DB.
exports.destroy = function(req, res) {
  models.Resultat.destroy({ where : { resultat_id: req.params.id }} ).then(function(resultat){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

// get distincts taxons inserted so far
exports.getTaxonNames = function(req, res) {
	var sql = 'select distinct navn_videnskabeligt, navn_dk from resultat where navn_videnskabeligt is not null ';
	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

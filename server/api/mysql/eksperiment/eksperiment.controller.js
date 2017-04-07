'use strict';
var models = require('../');
var qp = require('../nestedQueryParser');

// Get list of eksperiments
exports.index = function(req, res) {
	var query = (req.query) ? qp.parseQueryString(req.query) : undefined;
	query.include = [{ 
		model: models.Data,
		as: 'Data'
	}]
  models.Eksperiment.findAll(query).then(function(eksperiment) {
  	return res.json(200, eksperiment);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Get a single eksperiment
exports.show = function(req, res) {
  models.Eksperiment.find(req.params.id).then(function(eksperiment){
  	return res.json(200, eksperiment);	
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Creates a new eksperiment in the DB.
exports.create = function(req, res) {
  models.Eksperiment.create(req.body).then(function(eksperiment) {
    return res.json(201, eksperiment);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Updates an existing eksperiment in the DB.
exports.update = function(req, res) {
  models.Eksperiment.find({ where : { eksperiment_id: req.params.id }} ).then(function(eksperiment) {
    if (!eksperiment) { 
			return res.send(404); 
		}  
	  return eksperiment.updateAttributes(req.body);	  	
  }).then(function(eksperiment){
  	return res.json(200, eksperiment);
  }).catch(function(err){
	  handleError(res, err);
  });
};

// Deletes a eksperiment from the DB.
exports.destroy = function(req, res) {
  models.Eksperiment.destroy({ where : { eksperiment_id : req.params.id }} ).then(function(eksperiment){
	}).then(function(){
  	return res.json(200);
	}).catch(function(err){
	  handleError(res, err);
  });
};

// get resultat associated with eksperiment, if any
exports.resultat = function(req, res) {
	var sql = ''
		+ 'select r.* '
		+ 'from resultat r, data d, eksperiment e '
		+ 'where '
		+ 'r.data_id = d.data_id '
		+ 'and d.eksperiment_id = e.eksperiment_id '
		+ 'and e.eksperiment_id ='+req.query.id;

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(resultat) {
		return res.json(200, resultat[0]);
	}).catch(function(err){
	  handleError(res, err);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}

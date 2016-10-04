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

// Return data joined with results
exports.joinResultat = function(req, res) {
	var sql = `
		select data.*,
		eksperiment.myrejagt_id,
		date_format(eksperiment.dato, '%d/%m/%Y') as 'eksperiment_dato',
		resultat.resultat_id, 
		resultat.antal

		from data
		left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id 
		left join resultat on data.data_id = resultat.data_id 
		group by data.data_id
	`
	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
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

var models = require('../mysql');

exports.data = function(req, res) {
	var user_id = req.params && req.params.id ? req.params.id : undefined;
	var sql = `
		select 
		eksperiment.myrejagt_id as 'Myrejagt ID',
		date_format(eksperiment.dato, '%d/%m/%Y') AS 'Dato',

		data.eksperiment_id, 
		data.madding,
		data.maden_stjaalet,
		data.myrer_indsamlet,
		data.myrer_frysning,

		eksperiment.sol,
		eksperiment.vind,
		eksperiment.vejr,
		eksperiment.temp,
		eksperiment.lat,
		eksperiment.lng,
		eksperiment.dato,

		projekt.titel as projekt_navn,

		user.brugernavn,
		user.institution

		from data
		left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id 
		left join projekt on eksperiment.projekt_id = projekt.projekt_id
		left join user on eksperiment.user_id = user.user_id
	`
	sql += '	where user.user_id = '+ user_id

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};	

exports.gbif = function(req, res) {
	var sql = `
		select 
		data.data_id, 
		data.eksperiment_id, 
		data.madding,
		data.maden_stjaalet,
		data.myrer_indsamlet,
		data.myrer_frysning,

		eksperiment.myrejagt_id,
		eksperiment.sol,
		eksperiment.vind,
		eksperiment.vejr,
		eksperiment.temp,
		eksperiment.lat,
		eksperiment.lng,
		eksperiment.dato,

		projekt.titel as projekt_navn,

		user.brugernavn,
		user.institution

		from data
		left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id 
		left join projekt on eksperiment.projekt_id = projekt.projekt_id
		left join user on eksperiment.user_id = user.user_id
`
	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

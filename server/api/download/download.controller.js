var models = require('../mysql');

exports.data = function(req, res) {
	var user_id = req.params && req.params.id ? req.params.id : undefined;
	var sql = ''
		+'select '
		+'eksperiment.myrejagt_id as "Myrejagt ID", '
		+'date_format(eksperiment.dato, "%d/%m/%Y") as dato, '

		+'data.eksperiment_id, '
		+'data.madding, '
		+'data.madding_stjaalet, '
		+'data.myrer_indsamlet, '
		+'data.myrer_frysning, '

		+'eksperiment.sol, '
		+'eksperiment.vind, '
		+'eksperiment.vejr, '
		+'eksperiment.temp, '
		+'eksperiment.lat, '
		+'eksperiment.lng, '
		+'eksperiment.dato, '

		+'projekt.titel as projekt_navn, '

		+'resultat.*, '

		+'user.brugernavn, '
		+'user.institution '

		+'from data '
		+'left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id '
		+'left join projekt on eksperiment.projekt_id = projekt.projekt_id '
		+'left join user on eksperiment.user_id = user.user_id '
		+'left join resultat on resultat.data_id = data.data_id';

	if (user_id && user_id>0) sql += '	where user.user_id = '+ user_id

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};	

exports.gbif = function(req, res) {
	var sql = ''
		+'select '
		+'data.data_id, '
		+'data.eksperiment_id, '
		+'data.madding as samplingProtocol  , '

		+'eksperiment.myrejagt_id as datasetName, '
		+'concat_ws(", ", eksperiment.sol, eksperiment.vind, eksperiment.vejr, eksperiment.temp) as locationRemarks, '

		+'"DK" as countryCode , '
		+'eksperiment.lat as decimalLatitude, '
		+'eksperiment.lng as decimalLongitude, '
		+'eksperiment.dato as eventDate , '
		
		+'projekt.titel as projekt_navn, '

		+'resultat.antal as individualCount  , '
		+'resultat.navn_videnskabeligt as scientificName  , '
		+'resultat.navn_dk as vernacularName , '

		+'user.fulde_navn as individualCount, '
		+'user.institution '

		+'from data '
		+'left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id '
		+'left join projekt on eksperiment.projekt_id = projekt.projekt_id '
		+'left join user on eksperiment.user_id = user.user_id '
		+'left join resultat on data.data_id = resultat.data_id '

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};

exports.all = function(req, res) {
	var sql = ''
		+'select ' 
		+'user.*,  '
		+'eksperiment.*, '
		+'projekt.*,  '
		+'data.*,  '
		+'resultat.* '

		+'from user  '

		+'left join eksperiment on user.user_id = eksperiment.user_id  '
		+'left join projekt on eksperiment.projekt_id = projekt.projekt_id  '
		+'left join data on data.eksperiment_id = eksperiment.eksperiment_id ' 
		+'left join resultat on data.data_id = resultat.data_id ';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

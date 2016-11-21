var models = require('../mysql');

//species by number of results
exports.topSpeciesByOccurrence = function(req, res) {
	var sql = 'select navn_videnskabeligt, navn_dk, count(*) as `count` from resultat group by navn_videnskabeligt order by `count` desc limit 5';
	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};

//species by number, sum of antal
exports.topSpeciesByNumber = function(req, res) {

};


//species by user, sum of antal
exports.topSpeciesByUser = function(req, res) {
	var sql = ''
		+	'select r.navn_videnskabeligt, r.navn_dk, count(*) as `count` '
		+ 'from resultat r, data d, eksperiment e '
		+ 'where '
		+ 'e.user_id = 1 '
		+ 'and d.eksperiment_id = e.eksperiment_id '
		+ 'and d.data_id = r.data_id '
		+ 'group by navn_videnskabeligt order by `count` desc '
		+ 'limit 5';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}

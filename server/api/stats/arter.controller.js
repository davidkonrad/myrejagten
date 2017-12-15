var models = require('../mysql');

exports.getTotal = function(req, res) {

	var sql = ''
		+ 'select '
		+ 'sum(r.antal) as antal_dyr, count(*) antal_madding, r.navn_videnskabeligt, r.navn_dk, '
		
		+ '(select '
		+ 'count(distinct d.eksperiment_id) '
		+ 'from data d, resultat rr '
		+ 'where '
		+ 'd.data_id = rr.data_id '
		+ 'and rr.navn_videnskabeligt = r.navn_videnskabeligt) as antal_eksperimenter '

		+ 'from resultat r '
		+ 'where r.navn_videnskabeligt<>"" '
		+ 'group by r.navn_videnskabeligt '
		+ 'order by antal_eksperimenter desc ';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });

}

exports.getStats = function(req, res) {

	var sql = 'select '
		+ '(select count(distinct navn_videnskabeligt) from resultat where navn_videnskabeligt<>"") as antal_myre_arter, '
		+ '(select sum(myrer_indsamlet) from data) as myrer_indsamlet, '
		+ '(select sum(myrer_frysning) from data) as myrer_frysning, '
		+ '(select count(*) from eksperiment) as antal_eksperimenter ';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
}


exports.getEksperimenterByArt = function(req, res) {

	var sql = ''
		+ 'select '
		+ 'r.*, '
		+ 'd.madding, '
		+ 'e.* '
		+ 'from resultat r '
		+ 'left join data d on r.data_id = d.data_id '
		+ 'left join eksperiment e on e.eksperiment_id = d.eksperiment_id '
		+ 'where r.navn_videnskabeligt = "' + req.query.art + '" ';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });

}

function handleError(res, err) {
  return res.send(500, err);
}



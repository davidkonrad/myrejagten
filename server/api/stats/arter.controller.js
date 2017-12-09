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

function handleError(res, err) {
  return res.send(500, err);
}



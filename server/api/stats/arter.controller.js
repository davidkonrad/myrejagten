var models = require('../mysql');

exports.getTotal = function(req, res) {

	var sql = ''
		+ 'select r.navn_videnskabeligt, r.navn_dk, sum(r.antal) as antal '
		+ 'from resultat r '
		+ 'group by navn_videnskabeligt order by antal desc ';

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });

}


function handleError(res, err) {
  return res.send(500, err);
}
	


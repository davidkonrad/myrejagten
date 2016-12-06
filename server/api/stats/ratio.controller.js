var models = require('../mysql');

function createRatios(obj) {
	var total = 0;
	for (var i in obj) {
		total = total + (typeof obj[i] == 'number' ? obj[i] : 0)
	}
	for (var i in obj) {
		var prop = i+'Ratio';
		var val = obj[i] || 0;
		val = 100 * val / total;
		obj[prop] = Math.round(val * 100) / 100;
	}
	return obj
}

var madding = ['Vand', 'Saltvand', 'Sukkervand', 'Olie', 'Protein', 'Kammerjunker'];

//get total ratios
exports.getTotal = function(req, res) {
	var sql = '';
	for (var i=0, l=madding.length; i<l; i++) {
		if (sql) sql += ',';
		sql += '(select sum(d.myrer_frysning) from data d where d.madding = "' + madding[i] +'" ) as '+madding[i];
	}
	sql = 'select ' + sql;
	models.sequelize.query(sql,	{ type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		data = createRatios(data[0]);
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
}


//get user ratios
exports.getTotalUser = function(req, res) {

	// { param : { user_id: userId }}
	var user_id = req.query && req.query.user_id ? req.query.user_id : undefined;
	var sql = '';
	for (var i=0, l=madding.length; i<l; i++) {
		if (sql) sql += ',';
		sql += '(select sum(d.myrer_frysning) from data d, eksperiment e where e.user_id = ' + user_id + ' and d.eksperiment_id = e.eksperiment_id and d.madding = "'+ madding[i] + '" ) as '+madding[i];
	}
	sql = 'select ' + sql;
	models.sequelize.query(sql,	{ type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		data = createRatios(data[0]);
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
}

exports.getEksperiment = function(req, res) {
	var eksperiment_id = req.query && req.query.eksperiment_id ? req.query.eksperiment_id : undefined;

	//get eksperiment ratios
	var sql = '';
	for (var i=0, l=madding.length; i<l; i++) {
		if (sql) sql += ',';
		sql += '(select sum(d.myrer_frysning) from data d where d.madding = "' + madding[i] +'" and d.eksperiment_id='+eksperiment_id+') as '+madding[i];
	}
	sql = 'select ' + sql;
	models.sequelize.query(sql,	{ type: models.sequelize.QueryTypes.SELECT }).then(function(eks) {
		eks = createRatios(eks[0])
		return res.json(200, { eksperiment: eks });
	}).catch(function(err){
	  handleError(res, err);
  });

}

function handleError(res, err) {
  return res.send(500, err);
}


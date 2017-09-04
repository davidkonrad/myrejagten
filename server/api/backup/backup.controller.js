'use strict';
var models = require('../mysql');

// Get show create table tableName 
exports.getCreateTable = function(req, res) {
	var table = req.params.table;
	var SQL = 'show create table '+table;
	models.sequelize.query(SQL,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		return res.json(200, data);
	}).catch(function(err){
	  handleError(res, err);
  });
};


// Get table data as SQL inseerts
exports.getTableSQL = function(req, res) {
	var table = req.params.table;
	var SQL = 'select * from '+table;
	var result = '';
	var insertInto = 'insert into '+table+' (';
	models.sequelize.query(SQL,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
		var keys = Object.keys(data[0]);
		var fields = '';
		for (var i=0, l=keys.length; i<l; i++) {
			if (fields !='' ) fields+=',';
			fields += '`'+keys[i] +'`';
		}
		insertInto += fields + ') values(';
		
		for (var r=0, rl=data.length; r<rl; r++) {
			var row = data[r];
			var values = '';
			for (var i=0, l=keys.length; i<l; i++) {
				if (values != '') values += ',';
				if (!row[keys[i]]) {
					values += '""'
				} else {
					values += '"' + row[keys[i]].toString().replace(/"/g, '\\"') + '"';
				}
			}
			result = result + insertInto + values + ');' + "\n";

			if (r == data.length-1) return res.json(200, { sql: result });
		}
		//return res.json(200, { sql: result });
	}).catch(function(err){
	  handleError(res, err);
  });

};


function handleError(res, err) {
  return res.send(500, err);
}

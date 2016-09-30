var env = process.env.NODE_ENV || "development";
var config = require('../../config/environment');
var uploadDir = config.uploadDir;
var models = require('../mysql');
var Q = require('q');

exports.gbif = function(req, res) {
  models.Eksperiment.findAll().then(function(eks) {
		models.Data.findAll().then(function(data) {
			function getData(eksperiment_id) {
				return data.filter(function(d) {
					if (d.eksperiment_id == eksperimet_id) return d
				})
			}
			var e, d = [];
			for (var i=0, l=eks.length; i<l; i++) {
				e = eks[i];
				console.log('LOADING ***************************************')
				e.dataValues.Data = getData(e.eksperiment_id)
				d.push(e)
				if (i == (l-1))	{
          return res.json(200, d);
				}
			}
		})
	}).catch(function(err){
		console.log('ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ')
	  handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

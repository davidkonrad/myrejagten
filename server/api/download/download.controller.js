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
	/*
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
	*/

	var sql = '' +
	'select '+
	'resultat.*, '+
	'data.*, '+
	'eksperiment.*, '+
	'projekt.*, '+
  'user.* '+
	'from resultat  '+
	'left join data on resultat.data_id = data.data_id  '+
	'left join eksperiment on data.eksperiment_id = eksperiment.eksperiment_id  '+
	'left join projekt on eksperiment.projekt_id = projekt.projekt_id  '+
	'left join user on eksperiment.user_id = user.user_id  ';

	function getDynamicProperty(record) {
		for (var p in record) {
			if (record[p] == null) record[p] = 'Not set'
		}
		var prop = {
			bait: 	record.madding,
			baitMissing: record.madding_stjaalet ? 'Yes' : 'No',
			organismCountCollected: record.myrer_indsamlet,
			organismCountAfterFreeze: record.myrer_frysning,
			celsiusDegree: record.temp,
			wind: record.vind,
			sunShadow: record.sol,
			wheather: record.vejr
		}
		return JSON.stringify(prop).replace(/"/g, "'")
	}

	models.sequelize.query(sql,	{ bind: ['active'], type: models.sequelize.QueryTypes.SELECT }).then(function(data) {
			var resultat = [];
			for (var i=0, l=data.length; i<l; i++) {
				resultat.push({
					datasetName: data[i].myrejagt_id,
					recordNumber: data[i].eksperiment_id,
					eventDate: data[i].dato,
					eventTime: data[i].start_tid + '/' + data[i].slut_tid,
					decimalLatitude: data[i].lat,
					decimalLongitude: data[i].lng,
					verbatimLocality: data[i].lokalitet,
					recordedBy: data[i].brugernavn,
					basisOfRecord: 'MATERIAL_SAMPLE',
					dynamicProperties: getDynamicProperty(data[i]),
					identifiedBy: 'Julie Kock Sheard',
					scientificName: data[i].navn_videnskabeligt,
					individiualCount: data[i].antal,
					countryCode: 'DK',
					geodeticDatum: 'WGS84'
				})
				if (i == (l-1)) return res.json(200, resultat);
			}
	}).catch(function(err){
	  handleError(res, err);
  });
};

exports.all = function(req, res) {
	var sql = ''
		+'select ' 
		+'user.user_id as user_user_id, '
		+'user.hash as user_hash, '
		+'user.is_admin as user_is_admin, '
		+'user.confirmed as user_confirmed, '
		+'user.brugernavn as user_brugernavn, '
		+'user.password as user_password, '
		+'user.role as user_role, '
		+'user.institution as user_institution, '
		+'user.fulde_navn as user_fulde_navn, '
		+'user.adresse as user_adresse, '
		+'user.postnr as user_postnr, '
		+'user.by as user_by, '
		+'user.kommune as user_kommune, '
		+'user.region as user_region, '

		+'eksperiment.eksperiment_id as eksperiment_eksperiment_id, '
		+'eksperiment.created_timestamp as eksperiment_created_timestamp, '
		+'eksperiment.projekt_id as eksperiment_projekt_id, '
		+'eksperiment.user_id as eksperiment_user_id, '
		+'eksperiment.myrejagt_id as eksperiment_myrejagt_id, '
		+'eksperiment.dato as eksperiment_dato, '
		+'eksperiment.start_tid as eksperiment_start_tid, '
		+'eksperiment.slut_tid as eksperiment_slut_tid, '
		+'eksperiment.titel as eksperiment_titel, '
		+'eksperiment.lokalitet as eksperiment_lokalitet, '
		+'eksperiment.lat as eksperiment_lat, '
		+'eksperiment.lng as eksperiment_lng, '
		+'eksperiment.geometryWkt as eksperiment_geometryWkt, '
		+'eksperiment.adresse as eksperiment_adresse, '
		+'eksperiment.postnr as eksperiment_postnr, '
		+'eksperiment.by as eksperiment_by, '
		+'eksperiment.kommune as eksperiment_kommune, '
		+'eksperiment.region as eksperiment_region, '
		+'eksperiment.upload_billede as eksperiment_upload_billede, '
		+'eksperiment.temp as eksperiment_temp, '
		+'eksperiment.vejr as eksperiment_vejr, '
		+'eksperiment.sol as eksperiment_sol, '      
		+'eksperiment.vind as eksperiment_vind, '
		+'eksperiment.kommentar as eksperiment_kommentar, '
		+'eksperiment.data_kommentar as eksperiment_data_kommentar, '
		+'eksperiment.UTM as eksperiment_UTM, '

		+'projekt.projekt_id as projekt_projekt_id, '
		+'projekt.user_id as projekt_user_id, '
		+'projekt.created_timestamp as projekt_created_timestamp, '
		+'projekt.titel as projekt_titel, '
		+'projekt.lokalitet as projekt_lokalitet, '
		+'projekt.geometryWkt  as projekt_geometryWkt, '
		+'projekt.lat as projekt_lat, '
		+'projekt.lng as projekt_lng, '
		+'projekt.start_tid as projekt_start_tid, '
		+'projekt.slut_tid as projekt_slut_tid, '

		+'data.data_id as data_data_id, '
		+'data.eksperiment_id as data_eksperiment_id, '
		+'data.madding as data_madding, '
		+'data.myrer_indsamlet as data_myrer_indsamlet, '
		+'data.myrer_frysning as data_myrer_frysning, '
		+'data.madding_stjaalet as data_madding_stjaalet, '
		+'data.proeve_modtaget as data_proeve_modtaget, '
		+'data.proeve_analyseret as data_proeve_analyseret, '

		+'resultat.resultat_id as resultat_resultat_id, '
		+'resultat.data_id as resultat_data_id, '
		+'resultat.antal as resultat_antal, '
		+'resultat.navn_videnskabeligt as resultat_navn_videnskabeligt, '
		+'resultat.navn_dk as resultat_navn_dk, '
		+'resultat.genus as resultat_genus, '
		+'resultat.specie as resultat_specie, '
		+'resultat.kommentar as resultat_kommentar '

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

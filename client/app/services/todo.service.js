'use strict';

/**
	generates a todo list for the current user
*/

angular.module('myrejagtenApp')
  .factory('ToDo', function($q, Login, Eksperiment, Projekt) {

	return {

		account: function(user) {
			var alerts = [];
			var err = '';
			var	deferred = $q.defer();
			['fulde_navn', 'postnr'].forEach(function(field) {
				if (!user[field] || user[field].trim() == '') {
					if (err) err += ', ';
					err += field == 'fulde_navn' ? '<strong>fulde navn</strong>' : '<strong>'+field+'</strong>'
				}
				if (field == 'postnr' && err != '') {
					err += '.'
					if (err.match(/,/g) && err.match(/,/g).length > 0) err = err.replace(/,(?=[^,]*$)/, ' og ') 
					alerts.push({ 
						message: 'Brugeroplysninger : Du mangler at udfylde ' + err,
						type: 'alert-danger alert-brugeroplysninger',
					})
				}
				if (field == 'postnr') deferred.resolve(alerts)
			})
      return deferred.promise;
		},

		data: function(user) {

			var alerts = [];
			var err = '';
			var	deferred = $q.defer();

			function getEksName(e, index) {
				return e.titel && e.titel.trim() != '' ? e.titel : 'Myrejagt #'+index
			}
			function getEksLokalitetErr(e) {
				return !e.lat || !e.lng ? 'Sted / lokalitet er ikke angivet. ' : ''
			}
			function getEksDatoErr(e) {
				return !e.dato || !e.start_tid || !e.slut_tid ? 'Dato og tid mangler. ' : ''
			}
			function getEksAdresseErr(e) {
				return !e.adresse || 
							!e.postnr ||
							!e.by ||
							!e.kommune ||
							!e.region ? 'Adresseoplysninger mangler. ' : ''
			}
			function getEksDataErr(e) {
				if (!e.sol) return 'Angivelse af sol / skygge mangler. '
				if (!e.vind) return 'Angivelse af vindstyrke mangler. ' 
				if (!e.vejr) return 'Angivelse af vejrlig mangler. '
				if (typeof e.temp != 'number') return 'Angivelse af temperatur mangler. '  
				for (var i=0, l=e.Data.length; i<l; i++) {
					if (typeof e.Data[i].myrer_frysning != 'number' || typeof e.Data[i].myrer_indsamlet != 'number') {
						return 'En eller flere myre-optællinger manlger. '
					}
				}
				return ''
			}

			Projekt.query().$promise.then(function(projekt) {	

				function getProjektName(projekt_id) {
					for (var i=0, l=projekt.length; i<l; i++) {
						if (projekt[i].projekt_id == projekt_id) {
							return projekt[i].titel.trim() || projekt[i].lokalitet.trim() || 'Projekt #'+projekt_id
						}
					}
				}

				//query eksperiments for user
				var query = { user_id: user.user_id };
				if (user.role == 0) query.projekt_id = { '$gt': 0 };

				Eksperiment.query({ where: query }).$promise.then(function(data) {
					for (var i=0, l=data.length; i<l; i++) {
						var myrejagtName = getEksName(data[i], i);
						if (data[i].projekt_id > 0) {
							myrejagtName = getProjektName(data[i].projekt_id) + ', ' + myrejagtName
						}
						myrejagtName = myrejagtName.charAt(0).toUpperCase() + myrejagtName.slice(1)

						var hash = data[i].projekt_id > 0 
							? data[i].projekt_id + '_' + data[i].eksperiment_id
							: data[i].eksperiment_id
	
						var name = '<strong><a href="/eksperimenter#' + hash + '" title="Rediger ' + myrejagtName +'">' + myrejagtName +'</a></strong>'
						var err = getEksDatoErr(data[i])
						err += getEksLokalitetErr(data[i])
						err += getEksAdresseErr(data[i])
						err += getEksDataErr(data[i])
						if (err && err.trim() != '')	alerts.push({ 
							message: name + '  : ' + '<span class="text-danger">' + err + '</span>',
							type: 'alert-warning'
						})

						if (i==(l-1)) deferred.resolve(alerts)
					}
				})
			})

      return deferred.promise;
		}
	}

});
		



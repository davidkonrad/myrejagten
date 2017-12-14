'use strict';

/**
	service for kommuner & regioner 
	JSON downloaded from oiorest

	geometryWkt_details from https://services.kortforsyningen.dk/Geosearch
*/

angular.module('myrejagtenApp')
  .factory('KR', function($http) {

		var kommuner = null;
		var geometryWkt_details = null;

		return {
			init: function() {
				$.getJSON('assets/kommuner.json', function(json) {
					kommuner = json
				})
				$.getJSON('assets/kommuner_geometryWkt_details.json', function(json) {
					geometryWkt_details = json
				})
			},

			kommuneByNr: function(kommuneNr) {
				kommuneNr = kommuneNr ? kommuneNr.trim() : ''
				for (var i=0, l=kommuner.length; i<l; i++) {
					if (kommuner[i].nr.trim() == kommuneNr ) return kommuner[i]
				}
				return false
			},

			get: function() {
				return kommuner
			},

			geometryWkt_details: function() {
				return geometryWkt_details
			}
				
		}
});

//initialize
angular.module('myrejagtenApp').run(function(KR) {
	KR.init()
});


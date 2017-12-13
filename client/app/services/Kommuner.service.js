'use strict';

/**
	service for kommuner & regioner 
	JSON downloaded from oiorest
*/

angular.module('myrejagtenApp')
  .factory('KR', function($http) {

		var kommuner = null;

		return {
			init: function() {
				$.getJSON('assets/kommuner.json', function(json) {
					kommuner = json
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
			}
				
		}
});

//initialize
angular.module('myrejagtenApp').run(function(KR) {
	KR.init()
});


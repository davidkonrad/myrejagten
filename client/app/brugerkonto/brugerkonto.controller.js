'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$compile', '$timeout', '$modal', 'TicketService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, TicketService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	/*
	$scope.createForsoeg = function() {
		ForsoegModal.new($scope).then(function(created) {		
			alert(created)
		})
	}
	*/

		$('#institution').typeahead({
			afterSelect: function (item) {
				console.log('institution selected', item);
				var login = "davidkonrad", 
						password = "nhmdzm",
						url = 'https://services.kortforsyningen.dk/Geosearch?search&geometryWkt='+item.geometryWkt+'&resources=adresser&limit=10&login='+login+'&password='+password;
	
					//var geojsonLayer = L.geoJson(parse(item.geometryWkt));
				    $.getJSON(url, function(resp) {
								console.log(resp);
						})

			}, 
			items : 20,
			displayText: function(item) {
				return item.presentationString
			},
			source: function(query, process) {
				//TODO: run service with tickets instead of hardcoded username / password
				var login = "davidkonrad", 
						password = "nhmdzm",
						url = 'https://services.kortforsyningen.dk/Geosearch?search=*'+query+'*&resources=stednavne_v2&limit=100&ticket='+TicketService.get()

						console.log(url)
					//Børnehuset Fasangården
						// Herstedøster Skole

				return $.getJSON(url, function(resp) {
					var newData = [],
							types = ['gymnasium', 'uddannelsescenter', 'privatskoleFriskole', 'folkeskole', 'universitet', 
											'specialskole', 'daginstitution', 'fagskole']
					for (var i in resp.data) {
						//console.log(resp.data[i]);
						//console.log(resp.data[i].type, resp.data[i].subtype);
						if (~types.indexOf(resp.data[i].type) || ~types.indexOf(resp.data[i].subtype)) {
									//console.log(resp.data[i]);
									//newData.push(resp.data[i].presentationString);
									newData.push(resp.data[i]);
								} else {
									console.log(resp.data[i].type)
								}
							}			
							return process(newData);		
				    })
				  }
				})
	 

  }]);

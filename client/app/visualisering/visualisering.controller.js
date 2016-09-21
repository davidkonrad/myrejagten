'use strict';

angular.module('myrejagtenApp')
  .controller('VisualiseringCtrl', ['$scope', '$timeout', 'TicketService', 'Eksperiment',
	 function($scope, $timeout, TicketService, Eksperiment) {

		var eksperimentIcon = {
			iconUrl: 'assets/images/Circle_Yellow.png',
			iconSize: [25, 41],
			shadowSize: [50, 64], 
			iconAnchor: [12, 41], 
			shadowAnchor: [4, 62], 
			popupAnchor: [-2, -46] 
		}

		$scope.map = {
			events: {
				map: {
					enable: ['zoomstart', 'drag', 'click', 'dblclick', 'mouseover'],
					logic: 'emit'
				}
			},
			markers: [],
			center: {
				lat: 56.126627523318206,
				lng: 11.457741782069204,
				zoom: 7
			},
			defaults: {
				zoomAnimation: true,
				markerZoomAnimation: true,
				fadeAnimation: true
			},
			layers: {
        baselayers: {
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
						visible: true
				  },
				  googleHybrid: {
				    name: 'Google Hybrid',
				    layerType: 'HYBRID',
				    type: 'google',
						visible: false
				  },
					luftfoto: {
						name: "Orto forår (luffoto)",
						type: 'wms',
						url: "http://kortforsyningen.kms.dk/topo_skaermkort",
						layerOptions: {
							layers: "orto_foraar",
							servicename: "orto_foraar",
							version: "1.1.1",
							request: "GetMap",
							format: "image/jpeg",
							service: "WMS",
							styles: "default",
							exceptions: "application/vnd.ogc.se_inimage",
							jpegquality: "80",
							attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
							ticket: TicketService.get()
						}
					}
				}
			}
		}

		Eksperiment.query().$promise.then(function(eksperimenter) {
			function getMessage(e) {
				return e.titel.trim() != '' ? e.titel : e.adresse
			}
			eksperimenter.forEach(function(e) {
				if (e.lat && e.lng) $scope.map.markers.push({
					lat: parseFloat(e.lat),
					lng: parseFloat(e.lng),
					message: getMessage(e),
					//icon: eksperimentIcon
					 icon: {
  		      type: "awesomeMarker",
						prefix: 'fa',
  		      icon: "trophy",
  		      markerColor: "orange"
  			  }
				})
			})
		})
				
					
				
		

  }]);

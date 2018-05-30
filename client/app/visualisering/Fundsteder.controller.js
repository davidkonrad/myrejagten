'use strict';

angular.module('myrejagtenApp')
  .controller('FundstederCtrl', function($scope, $http, $timeout, Login, TicketService, leafletData, Eksperiment, Utils, Projekt, Data, UTM) {

		$('body').on('shown.bs.tab', 'a', function (e) {
			$timeout(function() {
	      leafletData.getMap('fundsteder-kort').then(function(map) {
  	      map.invalidateSize();
				})
      }, 100);
		});

		$http.get('api/stats/arterGetTotal').then(function(result) {
			$scope.arter = result.data;
			$scope.selected = { selected: 0 };
			$scope.select($scope.arter[0].navn_videnskabeligt);
		});

		$scope.select = function(art) {
			function getMessage(e) {
				var titel = e.titel.trim() != '' ? e.titel : e.adresse;
				var m = '<h4>' + e.myrejagt_id + ' | ' + titel + '</h4>';
				m+=Utils.fixDate(e.dato);
				if (e.kommentar) m+=', '+e.kommentar;
				var vejr = [];
				if (e.sol) vejr.push(e.sol);
				if (e.vejr) vejr.push(e.vejr);
				if (e.vind) vejr.push(e.vind);
				if (e.temp) vejr.push(e.temp + '&deg;');

				m+= vejr.length>0 ? '<p style="margin: 0px;font-weight:bold;">' + vejr.join(', ') + '</p>' : '';
				m+= e.upload_billede ? '<img src="' + e.upload_billede + '" style="width: 290px;cursor:pointer;" fancyboxable>' : '';

				return m
			}

			$http.get('api/stats/arterEksperimenter', { params: { art: art }}).then(function(result) {
				$scope.map.markers = [];
				result.data.forEach(function(e) {
					var year = new Date(e.dato).getFullYear();
					if (e.lat && e.lng) $scope.map.markers.push({
						layer: year == 2017 ? 'y2017' : 'y2018',
						lat: parseFloat(e.lat),
						lng: parseFloat(e.lng),
						message: getMessage(e),
						getMessageScope: function() { return $scope },
						icon: year == 2017 ? iconBlue : iconFuchsia
					})
				})
			})
		}

		var iconBlue = {
			iconUrl: 'assets/images/blue.png',
			iconSize: [15, 26],
			iconAnchor: [12, 21], 
			shadowAnchor: [4, 62], 
			popupAnchor: [-4, -20] 
		};
		var iconFuchsia = {
			iconUrl: 'assets/images/fuchsia.png',
			iconSize: [15, 26],
			iconAnchor: [12, 21], 
			shadowAnchor: [4, 62], 
			popupAnchor: [-4, -20] 
		};

		$scope.map = {
			events: {
				map: {
					enable: ['zoomstart', 'drag', 'click', 'dblclick', 'mouseover'],
					logic: 'emit'
				}
			},
			markers: [],
			paths: {},
			center: {
				lat: 56.1,
				lng: 11.65,
				zoom: 7
			},
			defaults: {
				zoomAnimation: true,
				markerZoomAnimation: true,
				fadeAnimation: true,
				tileLayerOptions: {
					detectRetina: true,
					reuseTiles: true
				}
			},
			layers: {
        baselayers: {
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
						visible: true,
						layerOptions: {
							mapOptions: {
								styles: DefaultGoogleStyles
						  }
						}
					},
					googleHybrid: {
				    name: 'Google Hybrid',
				    layerType: 'HYBRID',
				    type: 'google',
						visible: false,
						layerOptions: {
							mapOptions: {
								styles: DefaultGoogleStyles
						  }
						}
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
				},
				overlays: {
					y2017: {
						name: '2017',
						type: 'group',
						visible: true
					},
					y2018: {
						name: '2018',
						type: 'group',
						visible: true
					}
				}
			}
		};

});



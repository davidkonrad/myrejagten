'use strict';

angular.module('myrejagtenApp')
	.controller('KommuneKortCtrl', function($scope, $http, $timeout, TicketService, Geo, KR, leafletData, leafletMapEvents, Eksperiment) {

		$('body').on('shown.bs.tab', 'a', function (e) {
			$timeout(function() {
	      leafletData.getMap('kommune-kort').then(function(map) {
  	      map.invalidateSize();
				})
      }, 100);
		});

		Eksperiment.query().$promise.then(function(eksperimenter) {
			$scope.eksKommuner = {};
			eksperimenter.forEach(function(e) {
				var k = e.kommune+'';
				k = k.toLowerCase();
				k = k.replace('kommune', '');
				k = k.trim();
				if ($scope.eksKommuner[k]) {
					$scope.eksKommuner[k].count++
				} else {
					$scope.eksKommuner[k] = { count: 1 }
				}
			})
			$scope.runCached()
		});
		function countEksperimenter(navn) {
			var oldNavn = navn;
			navn = navn.toLowerCase();
			var count = 0;
			for (var k in $scope.eksKommuner) {
				if (k.indexOf(navn)>-1) {
					count = count + parseInt($scope.eksKommuner[k].count);
				}
			}
			return count
		}

		//remove road labels
		var styles = $.extend([], DefaultGoogleStyles);
		styles.push({
	    "featureType": "road",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  });
		//remove more labels
		styles.push({
	    "featureType": "administrative.neighborhood",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
  	  "featureType": "administrative.land_parcel",
  	  "elementType": "labels",
  	  "stylers": [
  	    { "visibility": "off" }
  	  ]
  	},{
  	  "featureType": "administrative.locality",
  	  "elementType": "labels",
  	  "stylers": [
  	    { "visibility": "off" }
  	  ]
  	});

		$scope.map = {
			events: {
				path: {
					enable: [ 'click', 'mouseover', 'mousedown' ],
					logic: 'emit'
				},
				map: {
					enable: ['zoomstart', 'drag', 'click', 'dblclick', 'mouseover', 'mousedown'],
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
								styles: styles 
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
								styles: styles 
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
				}
			}
		};

		function kommuneNavn(s) {
			s = s.replace(/ /g, '');
			s = s.replace(/[\/]/g, '');
			s = s.replace(/æ/g, 'ae');
			s = s.replace(/ø/g, 'oe');
			s = s.replace(/å/g, 'aa');
			s = s.replace(/é/g, 'e');
			s = s.replace(/-/g, '');
			return s;
		};

		var rainbow = new Rainbow(); 
		rainbow.setNumberRange(1, 10);
		rainbow.setSpectrum('darkgreen', 'lime');

		//live lookup of kommune geometryWkt_details
		$scope.runLive = function() {
			var kommuner = KR.get();
			kommuner.reverse(); //ensure kbh is last
			kommuner.forEach(function(kommune) {
				var url = 'https://services.kortforsyningen.dk/Geosearch?search='+kommune.nr+'&resources=kommuner&limit=1&ticket='+TicketService.get();
				$.ajax({
					url: url,
					success: function(data) {
						
						//probably a ticket problem
						//happens after kortforsyningen restart 
						if (!data.data) {
							console.error('Myrejagten fejl: ', data);
							console.log('Refreshing ticket ...');
							TicketService.refresh();
							return
						} 

						var wkt = new Wkt.Wkt();
						wkt.read(data.data[0].geometryWkt_detail);
						var polygons = [];
	
						function parse(array) {
							var poly = [];
							for (var o in array) {
								if (array[o].hasOwnProperty('length')) {
									parse(array[o]);
								} else {
									array[o].WGS84 = Geo.EPSG25832_to_WGS84(array[o].x, array[o].y);
									poly.push( { lat: array[o].WGS84.lng, lng: array[o].WGS84.lat });  
								}
							}
							polygons.push(poly);
						}
						parse(wkt.components);

						var eksCount = countEksperimenter(kommune.navn);
						var fillColor = '#ff0000';
						if (eksCount>10) {
							fillColor = '#'+rainbow.colourAt(10) 
						} else if (eksCount>0) {
							fillColor = '#'+rainbow.colourAt(eksCount) 
						}

						var messageStr = '<strong>'+kommune.navn+'</strong> kommune, '+ eksCount;
						messageStr += eksCount == 1 ? ' eksperiment' : ' eksperimenter';
							
						$scope.map.paths[kommuneNavn(kommune.navn)] = {
							type: "multiPolygon",
							weight: 1,
							color: '#000080',
							fillColor: fillColor, 
							fillRule: 'nonzero',
							fillOpacity: 0.8,
							latlngs: polygons,
							message: messageStr,
							getMessageScope: function() { return $scope },
						}
					},
					fail: function() {
						console.log(arguments)
					}
				})
			})
			$timeout(function() {
				$scope.kommuneWkt = SAVE;
			}, 500);
		}

		//show kommuner based on loaded JSON 
		$scope.runCached = function() {
			var kommuner = KR.geometryWkt_details();

			function render(kommune) {
				var wkt = new Wkt.Wkt();
				wkt.read(kommune.geometryWkt_detail);
				var polygons = [];
	
				function parse(array) {
					var poly = [];
					for (var o in array) {
						if (array[o].hasOwnProperty('length')) {
							parse(array[o]);
						} else {
							array[o].WGS84 = Geo.EPSG25832_to_WGS84(array[o].x, array[o].y);
							poly.push( { lat: array[o].WGS84.lng, lng: array[o].WGS84.lat });  
						}
					}
					polygons.push(poly);
				}
				parse(wkt.components);

				var eksCount = countEksperimenter(kommune.navn);
				var fillColor = '#ff0000';
				if (eksCount>10) {
					fillColor = '#'+rainbow.colourAt(10) 
				} else if (eksCount>0) {
					fillColor = '#'+rainbow.colourAt(eksCount) 
				}

				var messageStr = '<strong>'+kommune.navn+'</strong> kommune, '+ eksCount;
				messageStr += eksCount == 1 ? ' eksperiment' : ' eksperimenter';
							
				$scope.map.paths[kommuneNavn(kommune.navn)] = {
					type: "multiPolygon",
					weight: 1,
					color: '#000080',
					fillColor: fillColor, 
					fillRule: 'nonzero',
					fillOpacity: 0.8,
					latlngs: polygons,
					message: messageStr,
					getMessageScope: function() { return $scope }
				}
			}

			//need to render 0147 after all other due to leaflet-directive bug
			for (var nr in kommuner) {
				if (nr != '0147') {
					render(kommuner[nr]);
				} 
			}
			$timeout(function() {
				render(kommuner['0147'])
			}, 200);

		}

});


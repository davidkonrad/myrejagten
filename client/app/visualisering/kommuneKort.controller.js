'use strict';

angular.module('myrejagtenApp')
	.controller('KommuneKortCtrl', function($scope, $http, $timeout, $cookies, TicketService, Geo, KR, leafletData, Eksperiment) {

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
					Ingen: {
						name: 'Ingen kort',
						type: 'xyz',
						maxZoom: 18,
						minZoom: 5,
						url: '',
						layerOptions: {
							subdomains: 'abcd',
							attribution: 'Ingen kort',
							continuousWorld: true
						}
					},
					cartoDB: {
						name: 'CartoDB',
						type: 'xyz',
						maxZoom: 18,
						minZoom: 5,
						url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
						layerOptions: {
							subdomains: 'abcd',
							attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
							continuousWorld: true
						}
					},
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
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
						layerOptions: {
							mapOptions: {
								styles: styles 
						  }
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
		var defaultSettings = {
			zero: '#ffffff',
			from: '#98fb98', 
			to: '#134e13', 
			depth: 15
		}

		var cookieName = 'kommuner';
		var s = $cookies.get(cookieName);
		if (s) {
			$scope.settings = JSON.parse(s)
		} else {
			$scope.settings = $.extend({}, defaultSettings);
		}
		$scope.save = function() {
			var expireDate = new Date();
			expireDate.setTime(expireDate.getTime()+(365*24*60*60*1000)) //one year
			$cookies.put(cookieName, JSON.stringify($scope.settings), { expires: expireDate } )
		}

		$scope.update = function() {
			rainbow.setNumberRange(1, $scope.settings.depth);
			rainbow.setSpectrum($scope.settings.from, $scope.settings.to);

			for (var k in $scope.map.paths) {
				var p = $scope.map.paths[k];
				var fillColor = $scope.settings.zero;
				if (p.eksperimenter > $scope.settings.depth) {
					fillColor = '#'+rainbow.colourAt($scope.settings.depth) 
				} else if (p.eksperimenter > 0) {
					fillColor = '#'+rainbow.colourAt(p.eksperimenter) 
				}
				p.fillColor = fillColor;
			}

			$scope.save();
		}

		$scope.reset = function() {
			$scope.settings = $.extend({}, defaultSettings);
			$scope.map.center = {
				lat: 56.1,
				lng: 11.65,
				zoom: 7
			}
			$('#kommune-kort').focus();
		}

		$scope.$watch('settings.depth', function(newVal, oldVal) {
			if (!newVal || newVal == oldVal) return;
			$scope.update();
		})

		$scope.$watch('settings.zero', function(newVal, oldVal) {
			if (!newVal || newVal == oldVal) return;
			$scope.update();
		})

		$scope.$watch('settings.from', function(newVal, oldVal) {
			if (!newVal || newVal == oldVal) return;
			$scope.update();
		})

		$scope.$watch('settings.to', function(newVal, oldVal) {
			if (!newVal || newVal == oldVal) return;
			$scope.update();
		})
				
		//live lookup of kommune geometryWkt_details
		//only for use when retriveving geometryWkt's the first time
		/*
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
						if (eksCount>15) {
							fillColor = '#'+rainbow.colourAt(15) 
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
		*/

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
							poly.push( { lat: array[o].WGS84.lat, lng: array[o].WGS84.lng });  
						}
					}
					polygons.push(poly);
				}
				parse(wkt.components);

				var eksCount = countEksperimenter(kommune.navn);
				var messageStr = '<strong>'+kommune.navn+'</strong> kommune, '+ eksCount;
				messageStr += eksCount == 1 ? ' eksperiment' : ' eksperimenter';
							
				$scope.map.paths[kommuneNavn(kommune.navn)] = {
					eksperimenter: eksCount,
					type: "multiPolygon",
					weight: 1,
					color: '#000080',
					fillColor: '#fff', 
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
				$scope.update();
			}, 200);

		}

});


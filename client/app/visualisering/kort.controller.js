'use strict';

angular.module('myrejagtenApp')
  .controller('KortCtrl', function($scope, $http, $timeout, Login, TicketService, Eksperiment, Utils, Projekt, Data, UTM, Geo, leafletData) {

		Projekt.query().$promise.then(function(p) {
			$scope.projekter = p;
		});

		$scope.projektNameById = function(projekt_id) {
			for (var i=0, l=$scope.projekter.length; i<l; i++) {
				if ($scope.projekter[i].projekt_id == projekt_id) {
					return $scope.projekter[i].titel;
				}
			}
			return '';
		};

		var iconBlue = {
			iconUrl: 'assets/images/blue.png',
			iconSize: [15, 26],
			iconAnchor: [12, 21], 
			shadowAnchor: [4, 62], 
			popupAnchor: [-4, -20] 
		};
		var iconGreen = {
			iconUrl: 'assets/images/green.png',
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
			center: {
				lat: 56.126627523318206,
				lng: 11.457741782069204,
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
		};

		$scope.$on('leafletDirectiveMarker.click', function(e, marker) {
			marker.leafletObject.openPopup()
		});

		Eksperiment.query().$promise.then(function(eksperimenter) {
			function getData(e) {
					if (!e.Data || !e.Data.length) return ''
				var d = '<table style="width:180px;line-height:14px;border-collapse: separate;border-spacing:20px 0px;">';
				for (var i=0, l=e.Data.length; i<l; i++) {
					if (e.Data[i].maden_stjaalet || e.Data[i].myrer_indsamlet || e.Data[i].myrer_frysning) {
						d+= '<tr>';
						d+= '<td>' + e.Data[i].madding +'</td>';
						d+= '<td>' + (e.Data[i].maden_stjaalet == '1' ? '&times;' : '') +'</td>';
						d+= '<td>' + (typeof e.Data[i].myrer_indsamlet == 'number' ? e.Data[i].myrer_indsamlet : '0') + '</td>';
						d+= '<td>' + (typeof e.Data[i].myrer_frysning == 'number' ? e.Data[i].myrer_frysning : '0') + '</td>';
						d+= '</tr>'
					}
 				}
				d+='</table>'
				return d
			}				
			function getMessage(e) {
				var data = getData(e);
				var titel = e.titel.trim() != '' ? e.titel : e.adresse;

				var m = '<h4>' + e.myrejagt_id + ' | ' + titel + '</h4>';

				if (e.projekt_id>0) {
					m+='Projekt: <strong>'+$scope.projektNameById(e.projekt_id)+'</strong><br>';
				}
				m+='Udført af: <strong><small>'+ e.User.brugernavn + '</small></strong> d.' +Utils.fixDate(e.dato)+'<br>';
				
				var vejr = [];
				if (e.sol) vejr.push(e.sol);
				if (e.vejr) vejr.push(e.vejr);
				if (e.vind) vejr.push(e.vind);
				if (e.temp) vejr.push(e.temp + '&deg;');

				m+= vejr.length>0 ? '<p style="margin: 0px;font-weight:bold;">' + vejr.join(', ') + '</p>' : '';
				m+= data;
				m+= e.upload_billede ? '<img src="' + e.upload_billede + '" style="width: 290px;cursor:pointer;" fancyboxable>' : '';

				return m
			}
			eksperimenter.forEach(function(e) {
				if (e.lat && e.lng) $scope.map.markers.push({
					lat: parseFloat(e.lat),
					lng: parseFloat(e.lng),
					message: getMessage(e),
					getMessageScope: function() { return $scope },
					icon: iconBlue
				})
			})
		})

		$http.get('api/stats/arterGetStats').then(function(result) {
			$scope.stats = result.data[0]
		});


//-------------------------------
/*
		var url = 'https://services.kortforsyningen.dk/Geosearch?search=0101&resources=kommuner&limit=1&ticket='+TicketService.get();
		$.ajax({
			url: url,
			success: function(data) {
				//console.log(data.data[0]);
				var wkt = new Wkt.Wkt();
				wkt.read(data.data[0].geometryWkt_detail);
				console.log(wkt);

				var polygonOptions = {
					fillColor: '#ffff00',
					color: '#ffff00',
					weight: 3,
					fillRule: 'nonzero'
				}


				$scope.paths = {};
				leafletData.getMap().then(function(map) {
					//console.log('map then', map);
			    //$scope.map = map;

				var count = 0;
				function test(array) {
					count++;
					//console.log(array);
					var poly = [];
					for (var o in array) {
						//console.log(array[o]);
						if (array[o].hasOwnProperty('length')) {
							test(array[o]);
						} else {
							array[o].WGS84 = Geo.EPSG25832_to_WGS84(array[o].x, array[o].y);
							//poly.push(Geo.EPSG25832_to_WGS84(array[o].x, array[o].y));
							poly.push([array[o].WGS84.lat, array[o].WGS84.lng]); //Geo.EPSG25832_to_WGS84(array[o].x, array[o].y));
						}
					}

					//console.log('map', $scope.map);

					var a = [
						[55.61379008437097,12.505510990690711],
						[54.61379008437097,13.505510990690711],
						[54.61379008437097,14.505510990690711],
						[55.61379008437097,15.505510990690711],
						[55.61379008437097,12.505510990690711]
					];
					L.multiPolygon(a, {
						fillColor: '#00FF00',
						color: '#00FF00',
						weight: 3,
						fillOpacity: 0.6
					}).addTo(map)

					L.circle([50.5, 30.5], {
				    color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.5,
				    radius: 5000
					}).addTo(map);

					var circle = L.circle( [12.505510990690711,55.61379008437097], {
				    color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.5,
				    radius: 5000
					}).addTo(map);
					
					//polygons.push(L.polygon(poly, polygonOptions))
					
				}
				test(wkt.components);
				console.log(wkt.components);
				//console.log(polygons);
				})

			},
			fail: function() {
				console.log(arguments)
			}
		});
		*/

});



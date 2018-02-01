'use strict';

angular.module('myrejagtenApp').factory('ProjektDlg', ['$modal', '$q',	function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', '$timeout', 'Projekt', 'TicketService', 'leafletData', 'Geo', 'projekt_id', 'projekt_count', 'user_id', 
	function($scope, $timeout, Projekt, TicketService, leafletData, Geo, projekt_id, projekt_count, user_id) {

		$scope.projekt_id = projekt_id || false; //!!

		if (projekt_id) {
			Projekt.query({ where: { projekt_id: projekt_id }}).$promise.then(function(projekt) {
				$scope.__projekt = angular.copy(projekt[0]);
				$scope.__projekt.header = 'Rediger projekt';
				$scope.__projekt.lokalitetMethod = 'stednavne_v2';
				$scope.__projekt.btnCaption = 'Opdater og Luk';
				$timeout(function() {
					$scope.updateMapElements($scope.__projekt);
				})
			})
		} else {
			$scope.__projekt = { 
				header: 'Opret projekt',
				titel: 'Projekt #' + (projekt_count+1),
				lokalitetMethod: 'stednavne_v2',
				btnCaption: 'Opret og Luk',
				lokalitet: null,
				lat: null,
				lng: null,
				geometryWkt: null
			}
		}

		$scope.canCreateProjekt = function() {
			return $scope.__projekt &&
				$scope.__projekt.titel &&
				$scope.__projekt.lokalitet &&
				$scope.__projekt.lat &&
				$scope.__projekt.lng &&
				$scope.__projekt.start_tid 
		}

		$scope.closeModal = function(value) {
			$scope.$hide();					
			deferred.resolve(value);
		}

		$scope.doCreateProjekt = function() { 
			if ($scope.__projekt.projekt_id) {
				Projekt.update({ id: $scope.__projekt.projekt_id }, $scope.__projekt).$promise.then(function(res) {	
					$scope.closeModal(true)
				});
			} else {
				$scope.__projekt.user_id = user_id;
				Projekt.save({ projekt_id: '' }, $scope.__projekt).$promise.then(function(res) {	
					$scope.closeModal(true)
				});
			}
		}

		//adresseopslag
		var lokalitetPolygon;

		$scope.adresseType = 'stednavne_v2';
	
		$scope.adresseAfterSelect = function(eksperiment_id, adresseType, item) {
			$('#stednavne_v2').attr('title', item.presentationString)
			$scope.__projekt.geometryWkt = item.geometryWkt
			$scope.updateMapElements(item)
		}

		$scope.updateMapElements = function(item) { //item could be item from lookup or __projekt

			leafletData.getMap().then(function(map) {
				leafletData.getLayers().then(function(layers) {
					//why error after update ??
					/*
					for (var layer in layers.baselayers) {
						if (layer !== 'googleHybrid') {
							map.removeLayer(layers.baselayers[layer])
						} else {
							map.addLayer(layers.baselayers[layer])
						}
					}
					*/
				})

				if (lokalitetPolygon) map.removeLayer(lokalitetPolygon)
				lokalitetPolygon = geometryWktPolygon(item.geometryWkt, map)

				$timeout(function() {
					var center = lokalitetPolygon.__center;
					map.fitBounds(lokalitetPolygon.__bounds, { maxZoom: 15 } );
					map.setView(center);

					//lookup item or saved projekt
					if (!item.titel) {
						$scope.setMarker(center)
					} else {
						$scope.setMarker({ lat: parseFloat(item.lat), lng: parseFloat(item.lng) })
					}

					$timeout(function() {
						map.invalidateSize()
					})
				}, 100)
			})
		}

		/**
			for some reason EPSG:4326 is not supported by Kortforsyningen, 
			even they state the GeoService do, so wkt and Geo is needed
		*/
		var wkt = new Wkt.Wkt()

		function geometryWktPolygon(geometryWkt, map) {
			wkt.read(geometryWkt);
			var polygonOptions = {
				fillColor: '#ff0000',
				color: '#ffff00',
				weight: 3,
				fillRule: 'nonzero'
			}
			var center = []
			var polygons = []

			if (wkt.components[0].length) {
				for (var p=0; p<wkt.components.length;p++) {

					//force set adresseType
					//this should be fixed in a fure version
					$scope.adresseType = wkt.components[p][0].x > 100 ? 'stednavne_v2' : 'adresser';

					var points = wkt.components[p].map(function(xy) {
						if ($scope.adresseType == 'stednavne_v2') {
							var latLng = Geo.EPSG25832_to_WGS84(xy.x, xy.y)
							return [latLng.lat, latLng.lng]
						} else {
							return [xy.y, xy.x]
						}
					})
					center = center.concat(points)
					polygons.push(L.polygon(points, polygonOptions))
				}
			} else {
				var points = wkt.components.map(function(xy) {
					if ($scope.adresseType == 'stednavne_v2') {
						var latLng = Geo.EPSG25832_to_WGS84(xy.x, xy.y)
						return [latLng.lat, latLng.lng]
					} else {
						return [xy.y, xy.x]
					}
				})
				center = center.concat(points)
				polygons.push(L.polygon(points, polygonOptions))
			}

			var layer = L.layerGroup(polygons).addTo(map);
			var center = L.polygon(center);

			layer.__center = center.getBounds().getCenter()
			layer.__bounds = center.getBounds()

			return layer
		}

		//update center and lat, lng if marker is dragged
		$scope.$on('leafletDirectiveMarker.map.dragend', function(event, args) {
			$scope.setMarker(args.leafletEvent.target._latlng)
		})

		$scope.setMarker = function(latLng) {
			if (!$scope.marker) {
				$scope.marker = {
					lat: latLng.lat,
					lng: latLng.lng,
					focus: true,
					draggable: true
				}
				$scope.markers['marker'] = $scope.marker
			} else {
				$scope.marker.lat = latLng.lat
				$scope.marker.lng = latLng.lng
			}
			$scope.__projekt.lat = latLng.lat
			$scope.__projekt.lng = latLng.lng
		}

		//leaflet settings
		$scope.marker = null;
		angular.extend($scope, {
			events: {
				map: {
					enable: ['zoomstart', 'dragend', 'click', 'dblclick', 'mouseover', 'mousedown'],
					logic: 'emit'
				},
				markers: {
					enable: ['dragend', 'dragstart'],
					logic: 'emit'
				}
			},
			markers: {},
			center: {
				lat: 56.126627523318206,
				lng: 11.457741782069204,
				zoom: 6
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
						visible: false,
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
							attribution: "Indeholder data fra Geodatastyrelsen, WMS-tjeneste",
							ticket: TicketService.get()
						}
					},
				}
			}
		})

	}];

	return {
		show: function(projekt_id, projekt_count, user_id) {

			deferred = $q.defer();

			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'app/projekt/ProjektDlg.modal.html',
				backdrop: 'static',
				show: true,
				locals: { 
					projekt_id: projekt_id, 
					projekt_count: projekt_count,
					user_id: user_id
				}
			});

      return deferred.promise;
		}
			
	}

}]);



'use strict';

angular.module('myrejagtenApp')
  .controller('ProjektCtrl', ['$scope', '$compile', '$timeout', '$modal', '$q', 'Projekt', 'Geo', 'TicketService', 'leafletData', 
							'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, $q, Projekt, Geo, TicketService, leafletData,
						DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {



		var lokalitetPolygon;

		/*
		Projekt.query({ where: { projekt_id: 2 }}).$promise.then(function(projekt) {
			console.log('PROJEJT', projekt)
		})
		*/

		$scope.reloadProjekts = function() {
			Projekt.query({ where: { user_id: 0 }}).$promise.then(function(projekts) {
				$scope.projects = projekts
			})
		}
		$scope.reloadProjekts()

		/*
		$scope.projects = [{
			projekt_id : 1,
			created_timestamp: 'test',
			titel: 'dette er en titel'
		}]	
		*/

		$scope.dtOptions = DTOptionsBuilder.newOptions()
			.withDOM('t')
			.withOption('scrollY', '200px')
			.withOption('scrollCollapse', true)


		$scope.dtColumns = [
      DTColumnBuilder.newColumn(0).withTitle('#'),
      DTColumnBuilder.newColumn(1).withTitle('Titel'),
      DTColumnBuilder.newColumn(2).withTitle('Lokalitet'),
      DTColumnBuilder.newColumn(3).withTitle('Oprettet')
		]

		//$scope.createProjekt = function() {

		$scope.showProjekt = function(projekt_id) {
			$scope.marker = null
			$scope.markers = {} //['marker'] = null

			var showModal = function() {
				var modal = $modal({
					scope: $scope,
					templateUrl: 'app/projekt/projekt.modal.html',
					backdrop: 'static',
					show: true,
					internalName: 'projekt'
				})
			}

			if (projekt_id) {
				Projekt.query({ where: { projekt_id: projekt_id }}).$promise.then(function(projekt) {
					$scope.__projekt = angular.copy(projekt[0])
					$scope.__projekt.header = 'Rediger projekt'
					$scope.__projekt.lokalitetMethod = 'stednavne_v2'
					$scope.__projekt.btnCaption = 'Opdater og Luk'
					showModal()
				})
			} else {
				$scope.__projekt = { 
					header: 'Opret projekt',
					titel: '',
					lokalitetMethod: 'stednavne_v2',
					btnCaption: 'Opret og Luk',
					lokalitet: null,
					lat: null,
					lng: null,
					geometryWkt: null
				}
				showModal()
			}
		}

		$scope.canCreateProjekt = function() {
			return $scope.__projekt.titel &&
						$scope.__projekt.lokalitet &&
						$scope.__projekt.lat &&
						$scope.__projekt.lng &&
						$scope.__projekt.start_tid 
		}

		$scope.doCreateProjekt = function() { 
			if ($scope.__projekt.projekt_id) {
				Projekt.update({ id: $scope.__projekt.projekt_id }, $scope.__projekt).$promise.then(function() {	
					$scope.reloadProjekts()
				})
			} else {
				Projekt.save({ projekt_id: '' }, $scope.__projekt).$promise.then(function() {	
					$scope.reloadProjekts()
				})
			}
		}

		/**
			map related events and methods
		*/
		$scope.$on('modal.show', function(e, target) {
			$scope.initializeStednavne_v2($scope)
			if ($scope.__projekt.projekt_id) {
				$scope.updateMapElements($scope.__projekt)
			}
		})
		$scope.$on('modal.hide', function(e, target) {
			$scope.marker = null
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
		$scope.$on('leafletDirectiveMap.click', function(event, args){
			$scope.setMarker(args.leafletEvent.latlng)
		});
		$scope.$on('leafletDirectiveMap.zoom', function(event, args){
			if ($scope.marker) $scope.center = angular.copy($scope.marker)
		})
		$scope.$on('leafletDirectiveMarker.dblclick', function(e, marker) {
			$scope.center = {
				lat: $scope.marker.lat,
				lng: $scope.marker.lng,
				zoom: $scope.center.zoom>10 ? 5 : 16
			}
		})

		/**
			leaflet map attributes
		*/
		angular.extend($scope, {
			events: {
				map: {
					enable: ['zoomstart', 'drag', 'click', 'dblclick', 'mouseover'],
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
							attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
							ticket: TicketService.get()
						}
					},
					/* 
					matrikel: {
						name: 'Matrikel',
						type: 'wms',
						url: "http://{s}.services.kortforsyningen.dk/service",
						layerOptions: {
					    service: 'WMS',
					    transparent: true,
					    servicename: 'mat',
					    layers: 'Centroide,MatrikelSkel,OptagetVej',
					    version: '1.1.0',
					    ticket: TicketService.get(),
					    styles: 'sorte_centroider,sorte_skel,default',
					    format: 'image/png',
					    attribution: "Geodatastyrelsen",
					    continuousWorld: true,
					    minZoom: 9
						}
					}
					*/
				}
			}
		})

		/**
			for some reason EPSG:4326 is not supported by Kortforsyningen, 
			even they state the GeoService do, so wkt and Geo is needed
		*/
		var wkt = new Wkt.Wkt()

		function geometryWktLatLng(geometryWkt) {
			wkt.read(geometryWkt);
			if (!wkt.components[0].length) return null
			var xy = wkt.components[0][0]
			return Geo.EPSG25832_to_WGS84(xy.x, xy.y)
		}

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
					var points = wkt.components[p].map(function(xy) {
						var latLng = Geo.EPSG25832_to_WGS84(xy.x, xy.y)
						return [latLng.lng, latLng.lat]
					})
					center = center.concat(points)
					polygons.push(L.polygon(points, polygonOptions))
				}
			} else {
				var points = wkt.components.map(function(xy) {
					var latLng = Geo.EPSG25832_to_WGS84(xy.x, xy.y)
					return [latLng.lng, latLng.lat]
				})
				center = center.concat(points)
				polygons.push(L.polygon(points, polygonOptions))
			}

			var layer = L.layerGroup(polygons).addTo(map),
					center = L.polygon(center);

			layer.__center = center.getBounds().getCenter()
			layer.__bounds = center.getBounds()

			return layer

		}

		/**
			stednavn_v2, adresser opslag
		*/
		$scope.updateMapElements = function(item) { //item could be item from lookup or __projekt

			leafletData.getMap().then(function(map) {
				leafletData.getLayers().then(function(layers) {
					for (var layer in layers.baselayers) {
						if (layer !== 'googleHybrid') {
							map.removeLayer(layers.baselayers[layer])
						} else {
							map.addLayer(layers.baselayers[layer])
						}
					}
				})

				if (lokalitetPolygon) map.removeLayer(lokalitetPolygon)
				lokalitetPolygon = geometryWktPolygon(item.geometryWkt, map)

				$timeout(function() {
					//set to hybrid map
					$scope.layers.baselayers.googleHybrid.visible = true

					var center = lokalitetPolygon.__center
					map.fitBounds(lokalitetPolygon.__bounds, { maxZoom: 18 } )
					map.setView(center)
					$scope.setMarker(center)
					$timeout(function() {
						map.invalidateSize()
					})
				}, 100)
			})
		}

		$scope.initializeStednavne_v2 = function() {
			$('#stednavne_v2').typeahead('destroy')
			$('#stednavne_v2').typeahead({
				displayText: function(item) {
					switch ($scope.__projekt.lokalitetMethod) {
						case 'stednavne_v2' : 
							return item.presentationString
							break
						case 'adresser' :
							return item.presentationString
							break
						default :
							return null
					}
				},
				afterSelect: function(item) {
					$('#stednavne_v2').attr('title', item.presentationString)
					$scope.__projekt.geometryWkt = item.geometryWkt
					$scope.updateMapElements(item)
					/*
					leafletData.getMap().then(function(map) {

						leafletData.getLayers().then(function (layers) {
							for (var layer in layers.baselayers) {
								if (layer !== 'googleHybrid') {
									map.removeLayer(layers.baselayers[layer])
								} else {
									map.addLayer(layers.baselayers[layer])
								}
							}
						})

						$scope.__projekt.geometryWkt = item.geometryWkt

						if (lokalitetPolygon) map.removeLayer(lokalitetPolygon)
						lokalitetPolygon = geometryWktPolygon(item.geometryWkt, map)

						$timeout(function() {
							//set to hybrid map
							$scope.layers.baselayers.googleHybrid.visible = true

							var center = lokalitetPolygon.__center
							map.fitBounds(lokalitetPolygon.__bounds, { maxZoom: 20 } )
							map.setView(center)
							$scope.setMarker(center)
							$timeout(function() {
								map.invalidateSize()
							})
						}, 100)
						*/

					//})
				}, 
				items : 20,
			  source: function(query, process) {
					//var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=stednavne_v2&limit=100'+Utils.aePass;
					//var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=stednavne_v2&limit=100&geometry=true&outgeoref=EPSG:4326&ticket='+TicketService.get()
					var method = $scope.__projekt.lokalitetMethod
					if (!method) return
					var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources='+method+'&limit=100&ticket='+TicketService.get()
			    return $.getJSON(url, function(resp) {
						var data = [], caption = '';
						for (var i in resp.data) {
							data.push(resp.data[i]);
						}			
						return process(data);		
			    })
			  }
			})
		}
		$scope.$watch('__projekt.lokalitetMethod', function(newVal, oldVal) {
			if (!oldVal&& oldVal != newVal) {
				$scope.initializeStednavne_v2()
			}
		})



  }]);

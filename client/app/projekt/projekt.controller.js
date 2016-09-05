'use strict';

angular.module('myrejagtenApp')
  .controller('ProjektCtrl', ['$scope', 'Login', 'Alert', '$timeout', '$modal', '$q', 'Projekt', 'Eksperiment', 'Geo', 'TicketService', 'Utils', 'leafletData', 
							'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions',
	function($scope, Login, Alert, $timeout, $modal, $q, Projekt, Eksperiment, Geo, TicketService, Utils, leafletData,
						DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, DTDefaultOptions) {

		var lokalitetPolygon;

		$scope.dtProjektInstance = {}
		$scope.user = Login.currentUser()
		$scope.user.showName =  $scope.user.brugernavn.charAt(0).toUpperCase() + $scope.user.brugernavn.slice(1) + 's'

		$scope.dtProjektOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				Projekt.query({ where: { user_id: $scope.user.user_id }}).$promise.then(function(projekts) {
					$scope.projects = projekts
					defer.resolve(projekts)
				})
				return defer.promise;
	    })
			.withDOM('t')
			.withOption('scrollY', '200px')
			.withOption('scrollCollapse', true)
			.withSelect({
				style: 'single'
			})
			.withOption('initComplete', function() {
				angular.element('#dtProjekt').on('dblclick', 'tr', function(e) {
					console.log($scope.dtProjektInstance.DataTable.row(this).data())
					var $row =$scope.dtProjektInstance.DataTable.row(this)
					if ($row) {
						$row.select()
						$scope.showProjekt($row.data().projekt_id)
					}
				})
				angular.element('#dtProjekt').on('select.dt', function(e, dt, type, indexes) {
					$scope.currentProjektId = $scope.dtProjektInstance.DataTable.row( indexes[0] ).data().projekt_id
					$scope.$apply()
					//console.log($scope.currentProjektId)
				})
				angular.element('#dtProjekt').on('deselect.dt', function(e, dt, type, indexes) {
				})

			})

		$scope.projektLoaded = function() {
			//console.log('projektLoaded', $scope.currentProjektId)
			return typeof $scope.currentProjektId == 'number'
		}

		DTDefaultOptions.setLoadingTemplate('<img src="assets/ajax-loader.gif">')

		$scope.dtProjektColumns = [
      DTColumnBuilder.newColumn('projekt_id').withTitle('#').notVisible(), // withOption('visible', false),
      DTColumnBuilder.newColumn('titel').withTitle('Navn på projekt'),
      DTColumnBuilder.newColumn('lokalitet').withTitle('Lokalitet'),
      DTColumnBuilder.newColumn('created_timestamp').withTitle('Oprettet')
		]

		/**
			projekt modal
		*/
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
		$scope.$on('modal.show', function(e, target) {
			console.log(e, target)
			$scope.initializeStednavne_v2($scope)
			if ($scope.__projekt && $scope.__projekt.projekt_id) {
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
					//$scope.dtProjektInstance.
					$scope.dtProjektInstance.rerender()
				})
			} else {
				Projekt.save({ projekt_id: '' }, $scope.__projekt).$promise.then(function() {	
					$scope.dtProjektInstance.rerender()
					//$scope.reloadProjekts()
				})
			}
		}

		/** projekt selection
		
		*/

		/**
			map related events and methods
		*/
		$scope.$on('leafletDirectiveMap.click', function(event, args){
			//$scope.setMarker(args.leafletEvent.latlng)
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
					/* why error after update ??
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
					//set to hybrid map
					$scope.layers.baselayers.googleHybrid.visible = true

					var center = lokalitetPolygon.__center
					map.fitBounds(lokalitetPolygon.__bounds, { maxZoom: 15 } )
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


		/**
			eksperiment
		*/
		$scope.eksperimentMatrix = [
			{ madding: 'Vand' },
			{ madding: 'Saltvand' },
			{ madding: 'Sukkervand' },
			{ madding: 'Olie' },
			{ madding: 'Protein' },
			{ madding: 'Kammerjunker' }
		]

		$scope.showEksperiment = function(eksperiment_id) {
			$scope.__eksperiment = {
				eksperiment_id: eksperiment_id,
				projekt_id: $scope.currentProjektId
			}
			var modal = $modal({
					scope: $scope,
					templateUrl: 'app/projekt/eksperiment.modal.html',
					backdrop: 'static',
					show: true,
					//controller: 'EksperimentCtrl',
					QWERTY: 'yksikalsi',
					onShow: function() {
						console.log('onShow', arguments)
					}
				})
			}

		$scope.createEksperiment = function() {
			Alert.show($scope, 'Eksperiment', 'Opret nyt ekseriment?').then(function(ok) {
				if (ok) Eksperiment.save({	eksperiment_id: '' }, { user_id: $scope.user.user_id }).$promise.then(function() {
					$scope.reloadEksperimenter()
				})
			})
		}

		var mapDefaults = {
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
					luftfoto: {
						name: "Orto forår (luffoto)",
						type: 'wms',
						url: "http://kortforsyningen.kms.dk/topo_skaermkort",
						visible: true,
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
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
						visible: false
				  },
				  googleHybrid: {
				    name: 'Google Hybrid',
				    layerType: 'HYBRID',
				    type: 'google',
						visible: false
				  }
				}
			}
		}

		$scope.$on('leafletDirectiveMap.click', function(event, target){
			var latLng = target.leafletEvent.latlng
			var id = target.leafletEvent.target._container.id

			//click on lokalitet->map
			if (~id.indexOf('_lok')) {
				id = parseInt( id.match(/\d/)[0] )
				var e = $scope.eksperimentById(id)
				if (!e.map.marker) {
					e.map.marker = {
						lat: latLng.lat,
						lng: latLng.lng,
						focus: true,
						draggable: true
					}
					e.map.markers['marker'] = e.map.marker
				} else {
					e.map.marker.lat = latLng.lat
					e.map.marker.lng = latLng.lng
				}
			} else {
				//find "Lokalitet" tab and click()
				$timeout(function() {
					$('#'+ id)
						.closest('.eksperiment-block')
						.find('a[role="tab"]:contains("Lokalitet")')
						.click()
				})
			}
		});

		/**
			refresh maps if any	when clicking on eksperiment tabs #1 and #2
		*/
		$('body').on('click', '.eksperiment-block a[role="tab"]', function() {
			var index = parseInt($(this).attr('data-index'))
			if (index <= 1) {
				$(this).closest('.eksperiment-block').find('.eksperiment-map').each(function() {
					leafletData.getMap($(this).attr('id')).then(function(map) {
						$timeout(function() {
							map.invalidateSize();
						}, 100)
					})
				})
			}
		})

		$scope.refreshMaps = function() {
			console.log('refrershMaps')
			for (var i=0, l=$scope.eksperimenter.length; i<l; i++) {
				leafletData.getMap($scope.eksperimenter[i].mapId).then(function(map) {
					map.invalidateSize();
				})
				leafletData.getMap($scope.eksperimenter[i].mapId+'_lok').then(function(map) {
					map.invalidateSize();
				})
			}
		}

		$scope.reloadEksperimenter = function(projekt_id) {
			Eksperiment.query().$promise.then(function(eksperimenter) {
				eksperimenter = eksperimenter.map(function(e) {
					e.map = angular.copy(mapDefaults);
					e.mapId = 'map' + e.eksperiment_id;
					e.adresseType = 'adresser'
					e.start_td = '11:59'
					return e
				})
				$scope.eksperimenter = eksperimenter
				console.log(eksperimenter)
				$scope.refreshMaps()
			})
		}
		$scope.reloadEksperimenter()

		$scope.eksperimentById = function(eksperiment_id) {
			for (var i=0, l=$scope.eksperimenter.length; i<l; i++) {
				if ($scope.eksperimenter[i].eksperiment_id == eksperiment_id) return $scope.eksperimenter[i]
			}
			return false
		}

		$scope.updateEksperiment = function(formId) {
			var data = Utils.formToObj('#' + formId)
			console.log(data)
			if (data && data.eksperiment_id) {
				Eksperiment.update({ id: data.eksperiment_id }, data).$promise.then(function() {
					Utils.formReset('#' + formId)
				})
			}
		}

		$scope.eksperimentFormChanged = function(formId) {
			//console.log(formId, Utils.formIsEdited('#'+formId))
			return Utils.formIsEdited('#' + formId)
		}

		$scope.deleteEksperiment = function(eksperiment_id) {
			Alert.show($scope, '', 'Slet  eksperiment?').then(function(ok) {
				if (ok) Eksperiment.delete({	id: eksperiment_id }).$promise.then(function() {
					$scope.reloadEksperimenter()
				})
			})
		}

		$scope.eksperimentAdresseSelect = function(eksperiment_id, adresseType, item) {
			var form = angular.element('#formLokalitet'+eksperiment_id)
			switch (adresseType) {
				case 'adresser': 
					form.find('input[name="postnr"]').val( item.postCodeIdentifier )
					form.find('input[name="by"]').val( item.districtName )
					console.log('XYZ', item)
					break;

				default:
					break;
			}
			//console.log('eksperimentAdresseSelect', arguments)
		}

  }]);




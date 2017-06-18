'use strict';

angular.module('myrejagtenApp')
  .controller('ProjektCtrl', ['$scope', '$http', '$location', '$interval', '$sce', 'Login', 'Alert', 'KR', '$timeout', '$modal', '$q', 'Projekt', 'Eksperiment', 
			'ToDo', 'Data', 'Geo', 'TicketService', 'Utils', 'leafletData', 'UploadModal', 'CreateEksperiment', 'UTM','ProjektDlg',
	function($scope, $http, $location, $interval, $sce, Login, Alert, KR, $timeout, $modal, $q, Projekt, Eksperiment, 
			ToDo,	Data, Geo, TicketService, Utils, leafletData, UploadModal, CreateEksperiment, UTM, ProjektDlg) {

		$scope.user = Login.currentUser();

		//check for changes
		$scope.reloadToDo = function() {
			ToDo.data(Login.currentUser()).then(function(alerts) {
				$scope.alerts = alerts
			})
		}
		$scope.reloadToDo();
		$scope.to_trusted = function(html_code) {
	    return $sce.trustAsHtml(html_code);
		}

		//click on todo items
		$('body').on('click', '.todo-item', function() {
			$('html').addClass('wait');

			var projekt_id = $(this).attr('projekt-id');
			var eksperiment_id = $(this).attr('eksperiment-id');

			function scrollToEksperiment() {
				var stop = $interval(function() {
					var $eks = angular.element('#eksperiment-cnt-' + eksperiment_id);
					if ($eks) {
						$('html').removeClass('wait');
						$interval.cancel(stop);
            stop = undefined;
						if ($eks.offset()) {
							if (navigator.userAgent.indexOf('Opera') != -1) {
								$('html').animate({scrollTop: $eks.offset().top-20 }, 400);
								return
							}
							if (navigator.userAgent.indexOf('Firefox') != -1) {
								$('html, body').animate({scrollTop: $eks.offset().top-20 }, 400);
								return
							}
							$('body').animate({scrollTop: $eks.offset().top-20 }, 400);
						}
					}
				}, 100);
			}

			//skole
			if ($scope.user.role == 0) {
				if ($('.panel[projekt-id='+projekt_id+']').find('.in').length>0) {
					scrollToEksperiment();
				} else {
					$('.panel[projekt-id='+projekt_id+'] .no-underline').click();
					scrollToEksperiment();
				}
			} else {
				scrollToEksperiment();
			}
		})

		//is about to leave page, check for changes
		$scope.$on('$locationChangeStart', function(e) {
			var changes = false;
			$('.btn-eksperiment-save').each(function(i, btn) {
				if ($(btn).hasClass('btn-ku')) changes = true;
			})
			if (changes) {
				var leave = confirm("Du har lavet ændringer i dit eksperiment, som endnu ikke er gemt. Er du sikker på at du vil forlade siden?")
	  	  if (!leave) {
					e.preventDefault();
				}
			}
		});

		/**
			storage for all lists and predefined types
		*/
		$scope.items = {}

		/**
			Projekt
		*/
		$scope.items.projektSortering = [
			{ value: '-projekt_id', label: 'Nyeste' },
			{ value: 'projekt_id', label: 'Ældste' },
			{ value: 'titel', label: 'Navn' },
			{ value: '!eksperiment_count', label: 'Eksperimenter' },
		]
		$scope.projektSortering = { value: '-projekt_id' }

		var lokalitetPolygon;

		//reload projekts, only called if user == "skole"
		$scope.reloadProjekts = function() {
			Projekt.query({ where: { user_id: $scope.user.user_id }}).$promise.then(function(projekts) {
				$scope.projekts = projekts;
				$scope.projekts.forEach(function(projekt) {
					Eksperiment.query({ where: { projekt_id: projekt.projekt_id }}).$promise.then(function(e) {
						projekt.eksperiment_count = e.length;
					})
				})
			})
		}

		//check role, set projekt_id or reloadProjekts()
		if ($scope.user.role == 0) {
			if ($location.$$hash && $location.$$hash != '' && $location.$$hash.indexOf('_')) {
				var hash = $location.$$hash.split('_')
				$scope.projekt_id = parseInt(hash[0])
			}
			$scope.reloadProjekts()
		} else {
			$scope.projekt_id = 0;
		}

		var showName = $scope.user.brugernavn
		showName += showName.charAt( showName.length ).toLowerCase() != 's' ? '´s' : '´'
		$scope.user.showName = showName;

		$scope.projektLoaded = function() {
			return typeof $scope.currentProjektId == 'number'
		}

		$scope.skoleProjektClick = function(projekt_id) {
			$scope.projekt_id = projekt_id
			$scope.reloadEksperimenter(projekt_id)
		}

		/**
			projekt modal
		*/
		$('body').on('click', '.btn-projekt-edit', function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
			var projekt_id = $(this).attr('projekt-id');
			if (projekt_id) $scope.showProjekt(projekt_id);
			return false;
		})

		$scope.showProjekt = function(projekt_id) {
			$scope.marker = null
			$scope.markers = {} 

			var showHandler = $scope.$on('modal.show', function(e, target) {
				$scope.initializeStednavne_v2($scope)
				if ($scope.__projekt && $scope.__projekt.projekt_id) {
					$scope.updateMapElements($scope.__projekt);
				}
				showHandler();
			})
			var hideHandler = $scope.$on('modal.hide', function(e, target) {
				$scope.marker = null;
				$scope.reloadProjekts();
				hideHandler();
			})

			var showModal = function() {
				var scope = $scope.$new();
				scope.projekt_id = projekt_id;
				$scope.projektModal = $modal({
					templateUrl: 'app/projekt/ProjektDlg.modal.html',
					backdrop: 'static',
					show: true,
					internalName: 'projekt',
					placement: "center",
					scope: scope
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
					titel: 'Projekt #' + parseInt($scope.projekts.length+1),
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


		/**
			projekt
		**/
		$scope.canCreateProjekt = function() {
			return $scope.__projekt.titel &&
						$scope.__projekt.lokalitet &&
						$scope.__projekt.lat &&
						$scope.__projekt.lng &&
						$scope.__projekt.start_tid 
		}

		$scope.doCreateProjekt = function() { 
			if ($scope.__projekt.projekt_id) {
				Projekt.update({ id: $scope.__projekt.projekt_id }, $scope.__projekt).$promise.then(function(res) {	
				});
			} else {
				$scope.__projekt.user_id = $scope.user.user_id;
				Projekt.save({ projekt_id: '' }, $scope.__projekt).$promise.then(function(res) {	
					$scope.reloadProjekts();
				});
			}
		}

		$scope.deleteProjekt = function(projekt_id) {
			for (var i=0, l=$scope.projekts.length; i<l; i++) {
				if ($scope.projekts[i].projekt_id == projekt_id) {
					if ($scope.projekts[i].eksperiment_count > 0) {
						Alert.show($scope, 'Slet projekt', 'Du kan ikke slette et projekt der indeholder eksperimenter. Du må slette alle projektets eksperimenter først.', true).then(function() {
						})
					} else {
						Alert.confirm($scope, 'Slet projekt? Sletning kan ikke fortrydes.').then(function(answer) {
							if (answer) {
								$scope.projektModal.hide();
								Projekt.delete({ id: projekt_id }).$promise.then(function() {
									$scope.reloadProjekts();
								});
							}
						});
					}
				}
			}
		}

		/**
			map related events and methods
		*/
		$scope.$on('leafletDirectiveMap.*', function(event, args) {
		});

		$scope.$on('leafletDirectiveMap.zoom', function(event, args) {
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
							attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
							ticket: TicketService.get()
						}
					},
				}
			}
		})

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
					map.fitBounds(lokalitetPolygon.__bounds, { maxZoom: 17 } )
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
				}, 
				items : 20,
			  source: function(query, process) {
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
		$('body').on('show.bs.collapse', '.panel', function() {
			$scope.projekt_id = $(this).attr('projekt-id');
			$timeout(function() {
				$scope.$apply()
			})
		});
		

		/**
			image / video 
		*/			
		$scope.uploadImage = function(eksperiment_id, currentImage) {
			UploadModal.image($scope, eksperiment_id, currentImage).then(function(fileName) {	
				if (typeof fileName == 'string') {
					var e = $scope.eksperimentById(eksperiment_id);
					e.upload_billede = fileName
				}
			})
		};
		$scope.deleteImage = function(eksperiment_id, currentImage) {
			Alert.show($scope, 'Uploads', 'Er du sikker på du vil fjerne billedet?').then(function(ok) {
				if (ok) {
					$http.get('/api/upload/remove/'+encodeURIComponent(currentImage)).then(function(res) {
						Eksperiment.update({ id: eksperiment_id }, { upload_billede: null }).$promise.then(function(e) {
							var e = $scope.eksperimentById(eksperiment_id);
							e.upload_billede = undefined;
						})				
					})
				}
			})
		};

		$scope.items.jaNej = [
			{ value: 0, label: 'Nej' },
			{ value: 1, label: 'Ja' }
		];

		$scope.items.vejr = [
			{ value: 'Skyfrit', label: 'Skyfrit' },
			{ value: 'Halvskyet', label: 'Halvskyet' },
			{ value: 'Overskyet', label: 'Overskyet' },
			{ value: 'Regn', label: 'Regn' }
		];
		$scope.items.sol = [
			{ value: 'Ingen skygge', label: 'Ingen skygge' },
			{ value: 'Delvist i skygge', label: 'Delvist i skygge' },
			{ value: 'Helt i skygge', label: 'Helt i skygge' }
		];
		$scope.items.vind = [
			{ value: 'Vindstille', label: 'Vindstille' },
			{ value: 'Svag vind', label: 'Svag vind' },
			{ value: 'Kraftig vind', label: 'Kraftig vind' }
		];
		$scope.items.madding = [
			{ madding: 'Vand' },
			{ madding: 'Sukkervand' },
			{ madding: 'Saltvand' },
			{ madding: 'Olie' },
			{ madding: 'Protein' },
			{ madding: 'Kammerjunker' }
		];
		$scope.items.sortering = [
			{ value: '-eksperiment_id', label: 'Nyeste' },
			{ value: 'eksperiment_id', label: 'Ældste' },
			{ value: 'titel', label: 'Navn' }
		];
		$scope.sortering = { value: '-eksperiment_id' }

		/* 
			ui.checkbox seems not to set ng-dirty on the button when it is unchecked
		*/
		$scope.setNgDirty = function(event) {
			var element = angular.element(event.delegateTarget);
			if (!element.hasClass('ng-dirty')) element.addClass('ng-dirty');
		}

		$scope.createEksperiment = function() {
			CreateEksperiment.show($scope).then(function(myrejagt_id) {
				if (myrejagt_id) {
					var obj = {
						user_id: $scope.user.user_id, 
						projekt_id: $scope.projekt_id,
						titel: '',
						lokalitet: '',
						lat: '',
						lng: ''
					};

					Eksperiment.save({	eksperiment_id: '' }, obj).$promise.then(function(e) {

						$scope.items.madding.forEach(function(m) {
							Data.save({ data_id: ''}, { eksperiment_id: e.eksperiment_id, madding: m.madding })
						})

						//get #eks for projekt_id
						Eksperiment.query({ where: { projekt_id: $scope.projekt_id }}).$promise.then(function(p) {
							var updateValues = { 
								myrejagt_id: 'SNMMJ-'+myrejagt_id,
								titel: 'Myrejagt #' + p.length
							}
							Eksperiment.update({ id: e.eksperiment_id }, updateValues).$promise.then(function(e) {
								$scope.reloadEksperimenter()
							})
						})
					})
				}
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
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
						visible: false,
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
					}
				}
			}
		}
		var iconRed = {
			iconUrl: 'assets/images/red.png',
			iconSize: [25, 41],
			shadowSize: [50, 64], 
			iconAnchor: [12, 41], 
			shadowAnchor: [4, 62], 
			popupAnchor: [-2, -46] 
		}

		$scope.$on('leafletDirectiveMap.click', function(event, target){
			var latLng = target.leafletEvent.latlng;
			var id = target.leafletEvent.target._container.id;

			//click on lokalitet->map
			if (~id.indexOf('_lok')) {
				var eksperiment_id = parseInt( id.match(/\d+/)[0] )
				var e = $scope.eksperimentById(eksperiment_id)

				if (!e.map.marker) {
					e.map.marker = {
						lat: latLng.lat,
						lng: latLng.lng,
						focus: true,
						draggable: true
					}
					e.map.markers['marker'] = e.map.marker
				} else {
					//update lat,lng force save button to be enabled
					var formId = '#formLokalitet'+eksperiment_id
					var form = angular.element(formId)
					form.find('input[name="lat"]').val( latLng.lat )
					form.find('input[name="lng"]').val( latLng.lng )
					Utils.formSetDirty(formId)

					//remove red icon and message if present
					if (e.map.marker.hasOwnProperty('icon')) {
						delete e.map.marker.icon
						delete e.map.marker.message
					}
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
			if (index == 1)	$timeout(function() {
				$('input[name="adresse"]').focus()
			})
		})

		$scope.refreshMaps = function() {
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

			function createTime(time) {
				var d = new Date()
				if (time) {
					time = time.split(':')
					d.setHours( time[0] ? time[0] : 12, time[1] ? time[1] : 0  )
				}
				return d
			}

			Eksperiment.query({ where: { user_id: $scope.user.user_id, projekt_id: $scope.projekt_id} }).$promise.then(function(eksperimenter) {
				eksperimenter = eksperimenter.map(function(e) {
					e.map = angular.copy(mapDefaults);

					//create marker if lat ln is set
					if (e.lat && e.lng) {
						e.map.markers.marker = {
							lat: parseFloat(e.lat),
							lng: parseFloat(e.lng),
							focus: true,
							draggable: true,
						}
						e.map.center = {
							lat: parseFloat(e.lat),
							lng: parseFloat(e.lng),
							zoom: 6 //17
						}
					}

					e.mapId = 'map' + e.eksperiment_id;
					e.adresseType = 'adresser';
					e.start_tid = e.start_tid && e.start_tid != '00:00:00' ? createTime( e.start_tid ) : null;
					e.slut_tid = e.slut_tid && e.slut_tid != '00:00:00' ? createTime( e.slut_tid ) : null;
					
					return e
				})
				$scope.eksperimenter = eksperimenter
				if (eksperimenter.length <= 0) {
					$timeout(function() {
						$scope.$apply() //ensure immedatiate update of the buttons
					}, 10)
				}

				$scope.refreshMaps()

				$scope.eksperimenter.forEach(function(eks) {
					Utils.formReset('formResultater'+eks.eksperiment_id);
					Eksperiment.resultat({ id: eks.eksperiment_id }).$promise.then(function(resultat) {
						eks.hasResultat = resultat.length>0
					})
				})
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
			if (data && data.eksperiment_id) {
				Eksperiment.update({ id: data.eksperiment_id }, data).$promise.then(function() {
					Utils.formReset('#' + formId);
					$scope.reloadToDo();
				})
			}
		}
		$scope.updateEksperimentData = function(eksperiment_id) {
			var e = $scope.eksperimentById(eksperiment_id)
			e.Data.forEach(function(d) {
				Data.update({ id: d.data_id }, d)
			})
			var miljo = {
				temp: e.temp,
				vejr: e.vejr,
				sol: e.sol,
				vind: e.vind,
				data_kommentar: e.data_kommentar
			}
			Eksperiment.update({ id: eksperiment_id }, miljo).$promise.then(function() {
				Utils.formReset('#formResultater' + eksperiment_id);
				$scope.reloadToDo();
			})
		}

		$scope.eksperimentFormChanged = function(formId) {
			return Utils.formIsEdited('#' + formId)
		}

		$scope.deleteEksperiment = function(eksperiment_id) {
			Alert.show($scope, 'Slet  eksperiment', 'Er du sikker på at du vil slette eksperimentet?').then(function(ok) {
				if (ok) {
					//get latest data, what so ever
					Data.query({ where : { eksperiment_id: eksperiment_id }}).$promise.then(function(data) {
						data.forEach(function(d) {
							Data.delete({ id: d.data_id })
						});
						//delete the eksperiment itself
						Eksperiment.delete({	id: eksperiment_id }).$promise.then(function() {
							$scope.reloadProjekts();
						});
					});
				}
			});
		}

		//we assume Wkt is loaded
		var wkt = new Wkt.Wkt()

		$scope.findNearestAddress = function(lat, lng) {
			var	deferred = $q.defer();
			var url='http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=nadresse&geop='+lat+','+lng+'&hits=1&ticket='+TicketService.get()			
			$.getJSON(url, function(response) {
				if (response.features && response.features.length) {
		      deferred.resolve(angular.copy(response.features))
				}
			})
			return deferred.promise;
		}

		/*
			reset lokalitet input (but not hidden fields) to street address
			so user can continue typing a house or street number
		*/
		$scope.eksperimentAdresseClick = function(eksperiment_id) {
			var form = angular.element('#formLokalitet'+eksperiment_id);
			var item = 	form.find('input[name="adresse"]').data('item');			
			if (item) {
				form.find('input[name="adresse"]').val( item.streetName+' ');
				form.find('input[name="adresse"]').trigger('keyup');
			}
		}

		$scope.eksperimentAdresseSelect = function(eksperiment_id, adresseType, item) {

			function setLatLng(e, form, lat, lng) {
				form.find('input[name="lat"]').val( lat );
				form.find('input[name="lng"]').val( lng );
				form.find('input[name="UTM"]').val( UTM.get(lat, lng) );
				if (!e.map.marker) {
					e.map.marker = {
						lat: lat,
						lng: lng,
						focus: true,
						icon: iconRed,
						message: 'Zoom helt ind på kortet og klik for at angive den helt nøjagtige position.',
						draggable: true
					}
					e.map.markers['marker'] = e.map.marker;
				} else {
					e.map.marker.lat = lat;
					e.map.marker.lng = lng;
				}

				e.map.center = {
					lat: lat,
					lng: lng,
					zoom: 16
				}
				$scope.$apply();
			}

			function formatAdresse(a,p,b,k,r) {
				var r = a;
				r += ', ' + p + ' ' + b;
				return r;
			}

			var form = angular.element('#formLokalitet'+eksperiment_id);
			var e = $scope.eksperimentById(eksperiment_id);
			switch (adresseType) {
				case 'adresser': 
					wkt.read(item.geometryWkt);
					var point = wkt.components[0] && !wkt.components[0].length 
						? wkt.components[0]
						: wkt.components[0][0];

					if (point && !point.length) setLatLng(e, form, point.y, point.x);
							
					var kommuneNr = item.municipalityCode ? item.municipalityCode : item.municipalityCodes;
					var kommune = KR.kommuneByNr( kommuneNr );

					var adresse = item.streetName;
					adresse += item.streetBuildingIdentifier ? ' '+item.streetBuildingIdentifier : '';

					form.find('input[name="geometryWkt"]').val( item.geometryWkt );
					form.find('input[name="postnr"]').val( item.postCodeIdentifier );
					form.find('input[name="by"]').val( item.districtName );

					if (kommune) {
						form.find('input[name="kommune"]').val( kommune.navn );
						form.find('input[name="region"]').val( kommune.region.navn.replace('Region', '').trim() );
					}
	
					//store item on the input
					form.find('input[name="adresse"]').data('item', item);

					form.find('input[name="adresse"]').val( formatAdresse(
						adresse,
						item.postCodeIdentifier, 
						item.districtName,
						kommune ? kommune.navn : '',
						kommune ? kommune.region.navn : ''
					));

					Utils.formSetDirty('#formLokalitet'+eksperiment_id);
					break;

				case 'stednavne_v2': 
					wkt.read(item.geometryWkt);
					var point = wkt.components[0] && !wkt.components[0].length 
						? wkt.components[0]
						: wkt.components[0][0]

					var latLng = Geo.EPSG25832_to_WGS84(point.x, point.y)
					setLatLng(e, form, latLng.lng, latLng.lat)
					
					$scope.findNearestAddress(point.x, point.y).then(function(adresse) {
						var a = adresse[0].properties ? adresse[0].properties : null;
						if (a) {
							var kommune = KR.kommuneByNr( a.kommune_kode )
							form.find('input[name="adresse"]').val( item.skrivemaade_officiel +', ' + a.vej_navn +' '+ a.husnr )
							form.find('input[name="postnr"]').val( a.postdistrikt_kode )
							form.find('input[name="by"]').val( a.postdistrikt_navn )
							form.find('input[name="kommune"]').val( a.kommune_navn )
							form.find('input[name="region"]').val( kommune ? kommune.region.navn.replace('Region', '').trim() : '' )
						}
					})

					break;

				default:
					break;
			}
		}

  }]);





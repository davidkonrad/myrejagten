'use strict';

angular.module('myrejagtenApp')
  .controller('ProjektCtrl', function($scope, $http, $location, $interval, $sce, Login, Alert, KR, $timeout, $modal, $q, Projekt, 
	Eksperiment, ToDo, Data, Geo, TicketService, Utils, leafletData, leafletMarkerEvents, leafletMapEvents, UploadModal, CreateEksperiment, UTM, ProjektDlg) {

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
			jumpToEksperiment(eksperiment_id, projekt_id);
		});

		//jump to the desired eksperiment
		//used by todos and createEksperiment
		function jumpToEksperiment(eksperiment_id, projekt_id) {

			//if paginated eksperimenter, show the correct page
			if ($scope.pagedEksperimenter && $scope.pagedEksperimenter.length>0) {
				for (var i=0,l=$scope.pagedEksperimenter.length; i<l; i++) {
					var p = $scope.pagedEksperimenter[i];
					for (var ii=0,ll=p.length; ii<ll; ii++) {
						if (p[ii].eksperiment_id == eksperiment_id) {
							$scope.currentPage = i;
							break;
						}
					}
				}
			}

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
							$('html, body').animate({scrollTop: $eks.offset().top-20 }, 400);
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
				if ($scope.pagedEksperimenter && $scope.pagedEksperimenter.length>0) {
					$timeout(function() {
						scrollToEksperiment();
					}, 100)
				} else {
					scrollToEksperiment();
				}
			}
		}

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

		//storage for all lists and predefined types
		$scope.items = {}

		//Projekt sortering
		$scope.items.projektSortering = [
			{ value: '-projekt_id', label: 'Nyeste' },
			{ value: 'projekt_id', label: 'Ældste' },
			{ value: 'titel', label: 'Navn' },
			{ value: '!eksperiment_count', label: 'Eksperimenter' },
		]
		$scope.projektSortering = { value: '-projekt_id' }

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

		//projekt modal
		$('body').on('click', '.btn-projekt-edit', function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
			var projekt_id = $(this).attr('projekt-id');
			if (projekt_id) {
				$scope.showProjekt(projekt_id);
			}
			return false;
		})

		$scope.showProjekt = function(projekt_id) {
			ProjektDlg.show(projekt_id, $scope.projekts.length, $scope.user.user_id).then(function(value) {
				if (value) $scope.reloadProjekts()
			})
		}

		/**
			projekt
		**/

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

		//eksperiment
		$('body').on('show.bs.collapse', '.panel', function() {
			$scope.projekt_id = $(this).attr('projekt-id');
			$timeout(function() {
				$scope.$apply()
			})
		});
		
		//image / video 
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
							e.upload_billede = 'assets/foto-ikon.png';
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
		
		//ui.checkbox seems not to set ng-dirty on the button when it is unchecked
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

					$('html').addClass('wait');
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
								$scope.reloadEksperimenter();
								
								//jump to eksperiment
								$timeout(function() {
									jumpToEksperiment(e.eksperiment_id, $scope.projekt_id)
								}, 1010); //!?

							})
						})
					})
				}
			})
		}

		var mapDefaults = {
			events: {
				map: {
					enable: ['mousedown'],
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

		//refresh maps if any	when clicking on eksperiment tabs #1 and #2
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
			for (var i=0, l=$scope.eksperimenter.length; i<l; i++) {
				leafletData.getMap($scope.eksperimenter[i].mapId).then(function(map) {
					map.invalidateSize();
				})
				leafletData.getMap($scope.eksperimenter[i].mapIdLok).then(function(map) {
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

			function maddingOrder(madding) {
				if (madding == 'Vand') return 0;
				if (madding == 'Saltvand') return 1;
				if (madding == 'Sukkervand') return 2;
				if (madding == 'Olie') return 3;
				if (madding == 'Protein') return 4;
				if (madding == 'Kammerjunker') return 5;
				console.error('Ukendt madding type: ', madding);
				return 100;
			}

			Eksperiment.query({ where: { user_id: $scope.user.user_id, projekt_id: $scope.projekt_id} }).$promise.then(function(eksperimenter) {

				eksperimenter = eksperimenter.map(function(e) {
					e.map = angular.copy(mapDefaults);

					e.mapId = 'map' + e.eksperiment_id;
					e.mapIdLok = e.mapId+'_lok';

					//create markers
					e.map.markers.staticMarker = {
						lat: e.lat ? parseFloat(e.lat) : 0,
						lng: e.lng ? parseFloat(e.lng) : 0,
						opacity: e.lat ? 1 : 0,
						draggable: false,
						icon: {
							type: 'awesomeMarker',
							icon: 'home',
							prefix: 'fa',
							iconColor: 'white',
							markerColor: 'blue' 
						}
					}
					e.map.markers.draggableMarker = {
						lat: e.lat ? parseFloat(e.lat) : 0,
						lng: e.lng ? parseFloat(e.lng) : 0,
						opacity: e.lat ? 1 : 0,
						draggable: true,
						icon: {
							type: 'awesomeMarker',
							icon: 'home',
							prefix: 'fa',
							iconColor: 'white',
							markerColor: 'blue' 
						}
					}

					e.adresseType = 'adresser';
					e.start_tid = e.start_tid && e.start_tid != '00:00:00' ? createTime( e.start_tid ) : null;
					e.slut_tid = e.slut_tid && e.slut_tid != '00:00:00' ? createTime( e.slut_tid ) : null;

					//drag marker 
					$scope.$on('leafletDirectiveMarker.'+e.mapIdLok+'.dragend', function(event, args) {
						if (e.map.markers.draggableMarker.icon.markerColor == 'red') {
							e.map.markers.draggableMarker.focus = false;
							delete e.map.markers.draggableMarker.message;
						}
						e.map.markers.draggableMarker.icon.markerColor = 'green';
						e.map.markers.draggableMarker.icon.iconColor = 'white';
						e.map.markers.draggableMarker.icon.icon = 'question-circle';
						e.map.markers.draggableMarker.lat = args.model.lat;
						e.map.markers.draggableMarker.lng = args.model.lng;

						e.lat = args.model.lat;
						e.lng = args.model.lng;

						//
						findNearestAdresse(e.eksperiment_id, e.lat, e.lng)
						//
						var formId = '#formLokalitet'+e.eksperiment_id;
						var form = angular.element(formId);
						form.find('input[name="lat"]').val( args.model.lat );
						form.find('input[name="lng"]').val( args.model.lng );
						form.find('input[name="UTM"]').val( UTM.get(args.model.lat, args.model.lng) );
						Utils.formSetDirty(formId)
					});

					//set madding order					
					e.Data.forEach(function(d) {
						d.order = maddingOrder(d.madding)
					})

					//set default photo icon if no photo
					if (!e.upload_billede) e.upload_billede = 'assets/foto-ikon.png';

					return e
				})
				$scope.eksperimenter = eksperimenter
				if (eksperimenter.length <= 0) {
					$timeout(function() {
						$scope.$apply() //ensure immedatiate update of the buttons
					}, 10)
				}

				$scope.refreshMaps();

				$scope.eksperimenter.forEach(function(e) {
					if (e.lat && e.lng) {
						var adresse = e.adresse.split(',');
						setStaticMarkerMessage(e.eksperiment_id, adresse[0], adresse[1], '', e.kommune, e.UTM);
						$timeout(function() {
							e.map.markers.staticMarker.focus = true
						})
					}
					Eksperiment.resultat({ id: e.eksperiment_id }).$promise.then(function(resultat) {
						e.hasResultat = !!resultat.antal
					})
				});

				//create array for pagination
				var itemsPerPage = 10;        
				$scope.currentPage = 0;
        $scope.pagedEksperimenter = [];
				for (var i = 0; i < $scope.eksperimenter.length; i++) {
					if (i % itemsPerPage === 0) {
						$scope.pagedEksperimenter[Math.floor(i / itemsPerPage)] = [ $scope.eksperimenter[i] ];
					} else {
						$scope.pagedEksperimenter[Math.floor(i / itemsPerPage)].push($scope.eksperimenter[i]);
					}
				}

				$scope.range = function(start, end) {
					var ret = [];
					if (!end) {
						end = start;
						start = 0;
					}
					for (var i = start; i < end; i++) {
						ret.push(i);
					}
					return ret;
				};
				$scope.prevPage = function() {
					if ($scope.currentPage > 0) {
						$scope.currentPage--;
					}
				};
				$scope.nextPage = function() {
					if ($scope.currentPage < $scope.pagedEksperimenter.length - 1) {
						$scope.currentPage++;
					}
				};
				$scope.setPage = function() {
					$scope.currentPage = this.n;
				};

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
			//update markers if the update is of type #formLokalitet
			if (~formId.indexOf('formLokalitet')) {
				var id = formId.match(/\d+/)[0];
				var e = $scope.eksperimentById(id);

				//normalize the draggable marker
				e.map.markers.draggableMarker.lat = parseFloat(data.lat);
				e.map.markers.draggableMarker.lng = parseFloat(data.lng);
				e.map.markers.draggableMarker.icon.icon = 'home';
				e.map.markers.draggableMarker.icon.markerColor = 'blue';
				e.map.markers.draggableMarker.icon.iconColor = 'white';
				e.map.markers.draggableMarker.focus = false;
				delete e.map.markers.draggableMarker.message;

				//update staticmarker position
				e.map.markers.staticMarker.lat = e.map.markers.draggableMarker.lat;
				e.map.markers.staticMarker.lng = e.map.markers.draggableMarker.lng;
				e.map.markers.staticMarker.icon.icon = 'home';
				e.map.markers.staticMarker.icon.markerColor = 'blue';
				e.map.markers.staticMarker.icon.iconColor = 'white';
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

		//reset lokalitet input (but not hidden fields) to street address
		//so user can continue typing a house or street number
		$scope.eksperimentAdresseClick = function(eksperiment_id) {
			var form = angular.element('#formLokalitet'+eksperiment_id);
			var item = 	form.find('input[name="adresse"]').data('item');			
			if (item) {
				form.find('input[name="adresse"]').val( item.streetName+' ');
				form.find('input[name="adresse"]').trigger('keyup');
			}
		}

		//we assume Wkt is available
		var wkt = new Wkt.Wkt()

		var formatAdresse = function(a,p,b,k,r) {
			var r = a;
			r += ', ' + p + ' ' + b;
			return r;
		}

		var setStaticMarkerMessage = function(eksperiment_id, adresse, postnr, by, kommune, UTM) {
			var e = $scope.eksperimentById(eksperiment_id);
			var message = adresse+'<br>'+postnr+' '+by+'<br>'+kommune+'<br>'+UTM;
			e.map.markers.staticMarker.focus = false;
			delete e.map.markers.staticMarker.message;
			$timeout(function() {
				e.map.markers.staticMarker.message = '<div style="font-weight:bold;white-space: nowrap;">'+message+'</div>';
				//e.map.markers.staticMarker.focus = false;
				//e.map.markers.staticMarker.focus = true;
			})
		}

		$scope.eksperimentAdresseSelect = function(eksperiment_id, adresseType, item) {

			function setLatLng(e, form, lat, lng) {
				form.find('input[name="lat"]').val( lat );
				form.find('input[name="lng"]').val( lng );
				form.find('input[name="UTM"]').val( UTM.get(lat, lng) );

				e.map.markers.draggableMarker.icon.icon = 'question-circle';
				e.map.markers.draggableMarker.icon.markerColor = 'red';
				e.map.markers.draggableMarker.lat = lat;
				e.map.markers.draggableMarker.lng = lng;
				e.map.markers.draggableMarker.opacity = 1;
				e.map.markers.draggableMarker.message = 'Zoom ind på kortet og træk markeren hen til den helt nøjagtige position';
				e.map.markers.draggableMarker.focus = true;

				e.map.markers.staticMarker.icon.icon = 'home';
				e.map.markers.staticMarker.lat = lat;
				e.map.markers.staticMarker.lng = lng;
				e.map.markers.staticMarker.opacity = 1;

				e.map.center = {
					lat: lat,
					lng: lng,
					zoom: 16
				}
				$scope.$apply();
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
					setLatLng(e, form, latLng.lat, latLng.lng)
					findNearestAdresse(eksperiment_id, latLng.lat, latLng.lng);
					break;

				default:
					break;
			}
		}

		var findNearestAdresse = function(eksperiment_id, lat, lng) {
			var url='http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=nadresse&geop='+lng+','+lat+'&georef=EPSG:4326&geometry=true&hits=1&ticket='+TicketService.get()			
			$.getJSON(url, function(response) {
				if (response.features) {
					var prop = response.features[0].properties;
					var form = angular.element('#formLokalitet'+eksperiment_id);
					var kommune = KR.kommuneByNr( prop.kommune_kode );

					form.find('input[name="adresse"]').val( formatAdresse(
						prop.vej_navn+' '+prop.husnr,
						prop.postdistrikt_kode, 
						prop.postdistrikt_navn,
						kommune ? kommune.navn : '',
						kommune ? kommune.region.navn : '')
					);

					form.find('input[name="postnr"]').val( prop.postdistrikt_kode )
					form.find('input[name="by"]').val( prop.postdistrikt_navn )
					form.find('input[name="kommune"]').val( prop.kommune_navn )
					form.find('input[name="region"]').val( kommune ? kommune.region.navn.replace('Region', '').trim() : '' )

					setStaticMarkerMessage(
						eksperiment_id, 
						prop.vej_navn+' '+prop.husnr, 
						prop.postdistrikt_kode, 
						prop.postdistrikt_navn,
						kommune ? kommune.navn : '',
						form.find('input[name="UTM"]').val()
					)

				}
			})
		}

});


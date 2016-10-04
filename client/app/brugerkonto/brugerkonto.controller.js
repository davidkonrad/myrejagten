'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$http', '$timeout', '$modal', 'Geo', 'TicketService', 'Login', 'Utils', 'MysqlUser', 'Eksperiment', 'Projekt',
	function($scope, $http, $timeout, $modal, Geo, TicketService, Login, Utils, MysqlUser, Eksperiment, Projekt) {

		$scope.user = Login.currentUser()
		$scope.alerts = []

		$scope.formPersonligeChanged = function() {
			return Utils.formIsEdited('#form-personlige')
		}
		$scope.savePersonlige = function() {
			var updateObj = {
				user_id: $scope.user.user_id,
				institution: $scope.user.institution,
				fulde_navn: $scope.user.fulde_navn,
				adresse: $scope.user.adresse,
				postnr: $scope.user.postnr,
				by: ($scope.user.by),
				kommune: $scope.user.kommune,
				region: $scope.user.region
			}
			MysqlUser.update({ user_id: $scope.user.user_id }, updateObj).$promise.then(function() {	
				Utils.formReset('#form-personlige')
			})
		}

		$scope.formStamdataChanged = function() {
			return Utils.formIsEdited('#form-stamdata')
		}
		$scope.saveStamdata = function() {
			var updateObj = {
				user_id: $scope.user.user_id,
				brugernavn: $scope.user.brugernavn
			}
			MysqlUser.update({ user_id: $scope.user.user_id }, updateObj).$promise.then(function() {	
				Login.updateCookie()
				//Utils.formReset('#form-stamdata')
			})
		}

		$timeout(function() {
			$('#institution').typeahead({
				afterSelect: function(item) {
					this.$element[0].value = item.skrivemaade_officiel
					$scope.findNearestAddress(item.geometryWkt)
				}, 
				items : 20,
				displayText: function(item) {
					return item.presentationString
				},
			source: function(query, process) {
				//TODO: run service with tickets instead of hardcoded username / password
				var login = "davidkonrad", 
						password = "nhmdzm",
						url = 'https://services.kortforsyningen.dk/Geosearch?search=*'+query+'*&resources=stednavne_v2&limit=300&ticket='+TicketService.get()

					//	console.log(url)
					//Børnehuset Fasangården
						// Herstedøster Skole

				return $.getJSON(url, function(resp) {
					var newData = [],
							types = ['gymnasium', 'uddannelsescenter', 'privatskoleFriskole', 'folkeskole', 'universitet', 
											'specialskole', 'daginstitution', 'fagskole']
					for (var i in resp.data) {
						//console.log(resp.data[i]);
						//console.log(resp.data[i].type, resp.data[i].subtype);
						if (~types.indexOf(resp.data[i].type) || ~types.indexOf(resp.data[i].subtype)) {
									//console.log(resp.data[i]);
									//newData.push(resp.data[i].presentationString);
									newData.push(resp.data[i]);
								} else {
									//console.log(resp.data[i].type)
								}
							}			
							return process(newData);		
				    })
				  }
				})
		})		 

		/**
			reverse address lookup
		*/
		var wkt = new Wkt.Wkt()
		$scope.findNearestAddress = function(geometryWkt) {
			wkt.read(geometryWkt);

			if (!wkt.components[0].length) return

			/*
			console.log(wkt.toObject());
			var x = wkt.toObject()
			console.log(x.getBounds().getCenter())
			console.log(x.getBounds())
			*/

			/*
			console.log(wkt)
			console.log(wkt.components[0])

			var xy = wkt.components[0][0]			
			while (xy.length>0) { xy = xy[0] }
			console.log('XY', xy)
			*/

			console.log(wkt.components[0])
			var t = wkt.components[0]
			while (t.length && t.length>0) t=t[0]
			console.log('t', t)

			//var p = wkt.toObject().getBounds().getCenter()
			/*
			console.log(p)
			var latLng = Geo.EPSG25832_to_WGS84(p.lng, p.lat)
			console.log(latLng)
			//console.log(p)
			*/
			//var	deferred = $q.defer();
			var url='http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=nadresse&geop='+t.x+','+t.y+'&hits=1&ticket='+TicketService.get()			
			console.log(url)
			$.getJSON(url, function(response) {
				if (response.features && response.features.length) {
		 				console.log(response.features)
		      //deferred.resolve(angular.copy(response.features))
				}
			})
		}


		/**
			kommune lookup
		*/
		var setRegionByKommuneNr = function(kommuneNr) {
			for (var i=0, l=$scope.kommuner.length; i<l; i++) {
				if ($scope.kommuner[i].nr == kommuneNr) {	
					$scope.user.region = $scope.kommuner[i].region.navn.replace('Region ', '')
					return
				}
			}
		}

		$scope.updateAlerts = function() {
			var err = '';

			['fulde_navn', 'adresse', 'postnr', 'by', 'kommune', 'region' ].forEach(function(field) {
				if (!$scope.user[field] || $scope.user[field].trim() == '') {
					if (err) err += ', ';
					err += field == 'fulde_navn' ? '<strong>navn</strong>' : '<strong>'+field+'</strong>'
				}
				if (field == 'region' && err != '') {
					err += '.'
					//replace last , with og if number of , > 1
					if (err.match(/,/g).length > 1) err = err.replace(/,(?=[^,]*$)/, ' og ') 
					$scope.alerts.push({ 
						message: 'Brugeroplysninger : Du mangler at udfylde ' + err,
						type: 'alert-danger alert-brugeroplysninger',
					})
				}
			})

			function getEksName(e, index) {
				return e.titel && e.titel.trim() != '' ? e.titel : 'Myrejagt #'+index
			}
			function getEksLokalitetErr(e) {
				return !e.lat || !e.lng ? 'Sted / lokalitet er ikke angivet. ' : ''
			}
			function getEksDatoErr(e) {
				return !e.dato || !e.start_tid || !e.slut_tid ? 'Dato og tid mangler. ' : ''
			}
			function getEksAdresseErr(e) {
				return !e.adresse || 
							!e.postnr ||
							!e.by ||
							!e.kommune ||
							!e.region ? 'Adresseoplysninger mangler. ' : ''
			}
			function getEksDataErr(e) {
				if (!e.sol) return 'Angivelse af sol / skygge mangler. '
				if (!e.vind) return 'Angivelse af vindstyrke mangler. ' 
				if (!e.vejr) return 'Angivelse af vejrlig mangler. '
				if (typeof e.temp != 'number') return 'Angivelse af temperatur mangler. '  
				for (var i=0, l=e.Data.length; i<l; i++) {
					if (typeof e.Data[i].myrer_frysning != 'number' || typeof e.Data[i].myrer_indsamlet != 'number') {
						return 'En eller flere myre-optællinger manlger. '
					}
				}
				return ''
			}

			Projekt.query().$promise.then(function(projekt) {	

				function getProjektName(projekt_id) {
					for (var i=0, l=projekt.length; i<l; i++) {
						if (projekt[i].projekt_id == projekt_id) {
							return projekt[i].titel.trim() || projekt[i].lokalitet.trim() || 'Projekt #'+projekt_id
						}
					}
				}

				Eksperiment.query({ where: { user_id: $scope.user.user_id }}).$promise.then(function(data) {
					for (var i=0, l=data.length; i<l; i++) {

						var myrejagtName = getEksName(data[i], i);
						if (data[i].projekt_id > 0) {
							myrejagtName = getProjektName(data[i].projekt_id) + ', ' + myrejagtName
						}
						myrejagtName = myrejagtName.charAt(0).toUpperCase() + myrejagtName.slice(1)

						var hash = data[i].projekt_id > 0 
							? data[i].projekt_id + '_' + data[i].eksperiment_id
							: data[i].eksperiment_id

						var name = '<strong><a href="/eksperimenter#' + hash + '" title="Rediger ' + myrejagtName +'">' + myrejagtName +'</a></strong>'
						var err = getEksDatoErr(data[i])
						err += getEksLokalitetErr(data[i])
						err += getEksAdresseErr(data[i])
						err += getEksDataErr(data[i])
						if (err && err.trim() != '')	$scope.alerts.push({ 
							message: name + '  : ' + '<span class="text-danger">' + err + '</span>',
							type: 'alert-warning'
						})
					}
				})
			})

			$('body').on('click', '.alert-close', function() {
				var $alert = $(this).closest('.alert')
				$alert.slideUp(400)
			})
			$('body').on('click', '.alert-brugeroplysninger', function() {
				$scope.scrollToForm()
			})
		}
		$scope.updateAlerts()

		$scope.scrollToForm = function() {
			var $form = angular.element('#form-cnt')
			if ($form.offset()) $("body").animate({scrollTop: $form.offset().top-20 }, 400);

			//set tab to brugeroplysninger
			$timeout(function() {
				$form.find('a[role="tab"]:contains("Private oplysninger")').click()
			})

		}


  }]);

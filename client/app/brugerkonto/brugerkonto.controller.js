'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$compile', '$timeout', '$modal', 'TicketService', 'Login', 'Utils', 'MysqlUser',
					'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, TicketService, Login, Utils, MysqlUser,
						DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {


//http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=nadre…,6368956.465&hits=1&geometry=false&ticket=2b0284a4c7ca49d6f560753f65a64429


		$scope.user = Login.currentUser()

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
					$scope.findNearestAddress(item.geometryWkt)
					console.log(item)
					return item.skrivemaade_officiel
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

			var p = wkt.toObject().getBounds().getCenter()
			console.log(p)
			var url = 'http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=nadresse&geop='+p.lat+','+p.lng+'&hits=1&geometry=false&ticket='+TicketService.get()
			console.log(url)
			$.getJSON(url, function(response) {
				if (response.features && response.features.length) {
					var f = response.features[0].properties						
					$scope.user.adresse = f.vej_navn +' '+ f.husnr
					$scope.user.postnr = f.postdistrikt_kode
					$scope.user.by = f.postdistrikt_navn
					$scope.user.kommune = f.kommune_navn
					setRegionByKommuneNr(f.kommune_kode)
  			  $scope.$apply();
				}
			})

			var url = 'http://services.kortforsyningen.dk/?servicename=RestGeokeys_v2&method=adresse&geop='+p.lng+','+p.lat+'&georad=100&ticket='+TicketService.get()
			$.getJSON(url, function(response) {
				console.log('ØØØ', response)
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

		$.getJSON('assets/kommuner.json', function(kommuner) {
			//console.log(kommuner)
			$scope.kommuner = kommuner

			$scope.regioner = []
			kommuner.forEach(function(kommune) {
				Utils.arrayInsert($scope.regioner, kommune.region.navn.replace('Region ', ''))
			})

			$timeout(function() {
				$('#kommune').typeahead({
					displayText: function(item) {
						return item.navn
					},
					afterSelect: function(item) {
						console.log(item)
						$scope.user.region = item.region.nanvn.replace('Region ', '')
					}, 
					items : 20,
					source: $scope.kommuner
				})
			})
		})

		/**
			adresse lookup
		*/
		$timeout(function() {
			$('#adresse').typeahead({
				displayText: function(item) {
					return item.presentationString
				},
				afterSelect: function(item) {
					$scope.user.adresse = item.streetName + (item.streetBuildingIdentifier ? (' '+item.streetBuildingIdentifier) : '')
					$scope.user.postnr = item.postCodeIdentifier ? item.postCodeIdentifier : ''
					$scope.user.kommune = item.municipalityName ? item.municipalityName : ''
					$scope.user.by = item.districtName ? item.districtName : ''
					setRegionByKommuneNr(item.municipalityCode)
  			  $scope.$apply();
				}, 
				items : 20,
			  source: function(query, process) {
					var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=adresser&limit=100&ticket='+TicketService.get()
			    return $.getJSON(url, function(resp) {
						/*
						var data = [], caption = '';
						for (var i in resp.data) {
							data.push(resp.data[i]);
						}			
						return process(data);		
						*/
						return process(resp.data);		
			    })
			  }
			})
		})
	
  }]);

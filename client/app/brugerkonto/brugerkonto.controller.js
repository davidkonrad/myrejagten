'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$http', '$popover', '$timeout', 'PostNr', 'Geo', 'TicketService', 'Login', 'Utils', 'MysqlUser', 'Eksperiment', 'Projekt', 'CSV',
	function($scope, $http, $popover, $timeout, PostNr, Geo, TicketService, Login, Utils, MysqlUser, Eksperiment, Projekt, CSV) {

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
				postnr: ($scope.user.postnr ? $scope.user.postnr : ''),
				by: ($scope.user.by),
				kommune: $scope.user.kommune,
				region: $scope.user.region
			}
			console.log($scope.user.postnr)
			MysqlUser.update({ user_id: $scope.user.user_id }, updateObj).$promise.then(function(user) {	
				Login.updateCookie();	
				Utils.formReset('#form-personlige');
			})
		}


		/**
			remind user about lacking user information
		*/
		var pt = '<div class="popover popover-danger" tabindex="-1" > '
							+  '<div class="arrow"></div>'
							+	   '<h3 class="popover-title" ng-bind="title" ng-show="title"></h3>'
							+  '<div class="popover-content" ng-bind="content"></div>'
							+'</div>';
		
		var $pt = $('<div>').append(pt);
		var post_pt = $pt.clone().find('.popover').addClass('postnr-popover').end().html();
		var fuldenavn_pt = $pt.clone().find('.popover').addClass('fuldenavn-popover').end().html();

		var postnrPopover = null;
		var fuldenavnPopover = null;
		$timeout(function() {
			if (!$scope.user.postnr) postnrPopover = $popover(angular.element('#postnr'), {
				content: 'Vi ønsker ikke at vide hvor du bor, men vi kunne meget godt tænke os at vide hvilket postnummer du bor i ... ', 
				container: 'html',
				trigger: 'manual',
				show: true,
				template: post_pt,
				templateUrl: false,
				placement: 'right',
				animation: 'am-fade',
				viewport: '#postnr'
			});
			if (!$scope.user.fulde_navn) fuldenavnPopover = $popover(angular.element('#fulde_navn'), {
				content: 'Det fulde navn kan være dit rigtige navn, men også et sigende navn. Feltet benyttes som "Finder"-identifikator i datasindamlingen.', 
				container: 'html',
				trigger: 'manual',
				show: true,
				template: fuldenavn_pt,
				templateUrl: false,
				placement: 'top',
				animation: 'am-fade',
				viewport: '#fulde_navn'
			});
			$timeout(function() {
				$scope.$watch('user.postnr', function(newVal, oldVal) {
					if (newVal != oldVal) closePostnrPopover();
				});
				$('.postnr-popover').on('click', function() {
					closePostnrPopover();
				});
				$('.fuldenavn-popover').on('click', function() {
					closeFuldenavnPopover();
				});
				$('a[role="tab"]').on('click', function() {
					closePostnrPopover();
					closeFuldenavnPopover();
				});
				$scope.$on('$routeChangeStart', function(next, current) { 
					closePostnrPopover();
					closeFuldenavnPopover();
				});
			})
		}, 2000);
		var closePostnrPopover = function() {
			if (postnrPopover) {
				postnrPopover.hide();
				postnrPopover.destroy();
			}
		};
		var closeFuldenavnPopover = function() {
			if (fuldenavnPopover) {
				fuldenavnPopover.hide();
				fuldenavnPopover.destroy();
			}
		};

		/**
			institution
		*/
		$scope.institutionSelect = function(item) {
			$scope.user.institution = item.skrivemaade_officiel ? item.skrivemaade_officiel : 'Ukendt';
			$timeout(function() {
				$scope.$apply()
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
		$scope.postnrAfterSelect = function(item) {
			console.log('select', item);
			$scope.user.postnr = item.nr;
			$scope.user.by = item.navn;
			PostNr.getRemoteInfo(item.nr).then(function(info) {
				$scope.user.kommune = info.kommune;
				$scope.user.region = info.region;
			})
			$scope.$apply()
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
					//if (err.match(/,/g).length > 1) err = err.replace(/,(?=[^,]*$)/, ' og ') 
					if (err.match(/,/g) && err.match(/,/g).length > 1) err = err.replace(/,(?=[^,]*$)/, ' og ') 
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

/***********************
	download
***********************/
		$scope.downloadData = function() {
			$http.get('/api/download/data/'+$scope.user.user_id).then(function(res) {
				CSV.download(res.data, 'myrejagten.csv')
			})
		}


  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$http', '$popover', '$timeout', 'PostNr', 'Geo', 'TicketService', 'ToDo',
																	'Login', 'Utils', 'MysqlUser', 'Eksperiment', 'Projekt', 'CSV',
	function($scope, $http, $popover, $timeout, PostNr, Geo, TicketService, ToDo,
					Login, Utils, MysqlUser, Eksperiment, Projekt, CSV) {

		$scope.user = Login.currentUser();
		$scope.alerts = [];
		$scope.form = {};

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
			//console.log($scope.user.postnr)
			MysqlUser.update({ user_id: $scope.user.user_id }, updateObj).$promise.then(function(user) {	
				Login.updateCookie();	
				//Utils.formReset('#form-personlige');

		    $scope.form.formPersonlige.$setPristine();
				$timeout(function() {
					$scope.$apply();
				})

				$scope.userHaveUpdated = true;
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

		$scope.$watch('userHaveUpdated', function(newVal, oldVal) {
			if ($scope.userHaveUpdated && !$scope.user.postnr) {
				postnrPopover = $popover(angular.element('#postnr'), {
					content: 'Vi vil gerne bede om dit postnummer i forhold til vores evaluering af Myrejagten. Dit postnummer er ift. til din egen bopæl, ikke i forhold til hvor du udfører dine Myrejagten eksperimenter.',
					container: 'html',
					trigger: 'manual',
					show: true,
					template: post_pt,
					templateUrl: false,
					placement: 'right',
					animation: 'am-fade',
					viewport: '#postnr'
				});
			} else {
				closePostnrPopover();
			}

			if ($scope.userHaveUpdated && !$scope.user.fulde_navn) {
				fuldenavnPopover = $popover(angular.element('#fulde_navn'), {
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
			} else {
				closeFuldenavnPopover();
			}
		})

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
			$scope.user.postnr = item.nr;
			$scope.user.by = item.navn;
			PostNr.getRemoteInfo(item.nr).then(function(info) {
				$scope.user.kommune = info.kommune;
				$scope.user.region = info.region;
			})
			$scope.$apply()
		}

		/**
			get alerts / missing info for account
		*/
		ToDo.account($scope.user).then(function(alerts) {
			$scope.alerts = alerts;
		})
		
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
			var d = new Date();
			var date = Utils.strPad(d.getDate(), 2) + '-' + Utils.strPad(d.getMonth(), 2) + '-' + d.getFullYear();
			var user = $scope.user.brugernavn || $scope.user.fulde_navn || $scope.user.email;
			var fileName = 'myrejagten_' + user + '_' + date + '.csv';
			$http.get('/api/download/data/'+$scope.user.user_id).then(function(res) {
				CSV.download(res.data, fileName)
			})
		}


  }]);

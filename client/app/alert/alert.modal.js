'use strict';

angular.module('myrejagtenApp')
  .factory('Alert', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null,
				modal = null,
				name = 'alertParams'

		return {
			
			show: function($scope, title, message, okOnly, icon) {
				$scope[name] = {
					title: title,
					message: message,
					okOnly: okOnly,
					icon: 'fa-warning'
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/alert.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					//
				})

				$scope.alertModalClose = function(value) {
					delete $scope[name] 
					modal.hide()
		      deferred.resolve(value)
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 13) $scope.alertModalClose(true)
				})

	      return deferred.promise;
			}
		}

	}]);



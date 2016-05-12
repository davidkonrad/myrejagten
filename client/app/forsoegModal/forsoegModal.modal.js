'use strict';

angular.module('myrejagtenApp')
  .factory('ForsoegModal', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null,
				kommentar = null,
				modal = null;

		return {
			new: function($scope) {
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/forsoegModal/forsoegModal.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					//kommentar = angular.element('#kommentar')
					$timeout(function() {
						//kommentar.focus()
					})
				})
		
				$scope.forsoegModalOk = function() {
					modal.hide()
		      deferred.resolve(true)
				}

				$scope.forsoegModalCancel = function() {
					modal.hide()
				}

	      return deferred.promise;
			}
		}

	}]);



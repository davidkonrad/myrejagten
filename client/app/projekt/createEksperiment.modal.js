'use strict';

angular.module('myrejagtenApp')
  .factory('CreateEksperiment', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null;
		var modal = null;

		return {
			show: function($scope) {
				$scope.__createMyrejagtId = '';
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/projekt/createEksperiment.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.__createEksperimentMyrejagtIdOK = function() {
					var id = angular.element('#myrejagt-id');
					return !id.length ? false : id.val().length == 4
				}

				modal.$promise.then(modal.show).then(function() {
					$timeout(function() {
						angular.element('#myrejagt-id').focus()
					}, 100)
				})

				$scope.__createEksperimentClose = function(value) {
					if (value) value = angular.element('#myrejagt-id').val();
					modal.hide();
		      deferred.resolve(value)
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 27) $scope.__createEksperimentClose(false)
				})

	      return deferred.promise;
			}

		}

	}]);



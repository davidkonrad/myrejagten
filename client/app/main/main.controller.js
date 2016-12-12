'use strict';

angular.module('myrejagtenApp')
  .controller('MainCtrl', ['$scope', '$timeout', '$location', 'MysqlUser', '$modal', 'Login', 'RememberMe',
	 function($scope, $timeout, $location, MysqlUser, $modal, Login, RememberMe) {

		$scope.isLoggedIn = Login.isLoggedIn();
		$scope.rememberMe = RememberMe.get();
		$scope.error = null;

		$scope.login = function() {
			Login.login($scope.rememberMe.m, $scope.rememberMe.p, $scope.rememberMe.rememberMe).then(function(response) {
				if (response && response.error) {
					console.log(response)
					$scope.error = response.error
				} else {
					$scope.error = null;
					$location.path('/konto');
				}
			})
			.catch( function(err) {
				$scope.errors.other = err.message;
			});
		}

		$scope.canLogin = function() {
			return $scope.rememberMe.m && $scope.rememberMe.p
		}

  }]);

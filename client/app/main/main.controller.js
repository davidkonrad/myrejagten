'use strict';

angular.module('myrejagtenApp')
  .controller('MainCtrl', ['$scope', '$timeout', '$location', 'MysqlUser', '$modal', 'Login', 'RememberMe',
	 function($scope, $timeout, $location, MysqlUser, $modal, Login, RememberMe) {

		$scope.isLoggedIn = Login.isLoggedIn();
		$scope.rememberMe = RememberMe.get();

		$scope.login = function() {
			Login.login($scope.rememberMe.m, $scope.rememberMe.p, $scope.rememberMe.rememberMe).then(function(response) {
				if (response && response.error) {
					$scope.errors.other = response.error
				} else {
					$location.path('/konto');
				}
			})
			.catch( function(err) {
				$scope.errors.other = err.message;
			});
		}

  }]);

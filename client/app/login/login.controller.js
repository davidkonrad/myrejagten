'use strict';

angular.module('myrejagtenApp')
  .controller('LoginCtrl', function ($scope, Login, $location, RememberMe) {

	$scope.user = RememberMe.get();
	$scope.errors = {};

	$scope.login = function(form) {

		if (form.$valid) {
			Login.login($scope.user.m, $scope.user.p, $scope.user.rememberMe).then(function(response) {
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
	}

});

'use strict';

angular.module('myrejagtenApp')
  .controller('LoginCtrl', function ($scope, Login, $location, $window, $cookieStore) {

    $scope.user = {};
    $scope.errors = {};

	var rememberMe = $cookieStore.get('rememberMe');
	if (rememberMe) {
		$scope.user.email = rememberMe.m;
		$scope.user.password = rememberMe.p;
		$scope.user.rememberMe = true;
	}
	
    $scope.login = function(form) {

		if ($scope.user.rememberMe) {
			$cookieStore.put('rememberMe', { 'm' : $scope.user.email, 'p' : $scope.user.password} );
		} else {
			$cookieStore.remove('rememberMe');
		}

      $scope.submitted = true;

      if(form.$valid) {
        Login.login($scope.user.email, $scope.user.password)
        .then( function(response) {
					if (response && response.error) {
						$scope.errors.other = response.error
					} else {
			      $location.path('/');
					}
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });

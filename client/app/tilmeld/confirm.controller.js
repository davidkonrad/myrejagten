'use strict';

angular.module('myrejagtenApp')
  .controller('ConfirmCtrl', ['$scope', '$timeout', '$location', 'MysqlUser', 'RememberMe',  
	function($scope, $timeout, $location, MysqlUser, RememberMe) {

/*
http://localhost:9000/bekræft-email/#sdfsdfsdfsdf
http://localhost:9000/bekræft-email/#qwerty
*/

		var hash = $location.$$hash;
		if (!hash || hash.trim().length == 0) {
			$location.path('/');
		}

		MysqlUser.query({ where: { hash: hash }} ).$promise.then(function(user) {
			$scope.user = user[0]

			$timeout(function() {
				$scope.$apply()
			})

			if ($scope.user) {
				//rememberMe so the user can login right away
				RememberMe.put($scope.user.email, $scope.user.password, true);

				//update confirmed
				MysqlUser.update({ id: $scope.user.user_id }, { confirmed: true }).$promise.then(function() {
				})
			} else {
				$scope.error = true
			}

			//redirect without hash
			$timeout(function() {
				$location.url($location.path());
			}, 5000)
			
		})

  }]);

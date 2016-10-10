'use strict';

angular.module('myrejagtenApp')
  .controller('GlemtPasswordCtrl', ['$scope', '$http', '$timeout', '$location',  
	function($scope, $http, $timeout, $location) {

		$scope.email = ''; 
		$scope.emailSent = null;

		$scope.sendEmail = function() {
			$http.post('api/email/glemtPassword/', { email: $scope.email }).then(function(response) {
				$scope.emailSent = response.data ? response.data : '...'

				$timeout(function() {
					$location.url($location.path());
				}, 5000)

			})
		}


  }]);

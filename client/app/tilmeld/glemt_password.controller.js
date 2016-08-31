'use strict';

angular.module('myrejagtenApp')
  .controller('GlemtPasswordCtrl', ['$scope', '$location', 'MysqlUser', 'Login', '$modal', 
	function($scope, $location, MysqlUser, Login, $modal) {

		//console.log($location)

		$scope.email = $location.$$search.email;

  }]);

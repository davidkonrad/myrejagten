'use strict';

angular.module('myrejagtenApp')
  .controller('MainCtrl', ['$scope', '$compile', '$timeout', '$http', 'MysqlUser', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	 function($scope, $compile, $timeout, $http, MysqlUser, $modal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

		//User.query().$promise.then(function(proever) {	
		MysqlUser.query({ where : { password: 'XXtest' }}).$promise.then(function(x) {
			console.log(x, x[0])
			//console.log(x)
		})


  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$compile', '$timeout', '$modal', 'ForsoegModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, ForsoegModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	$scope.createForsoeg = function() {
		ForsoegModal.new($scope).then(function(created) {		
			alert(created)
		})
	}
	

  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('PhdCtrl', ['$scope', '$compile', '$q', '$timeout', '$modal', 'Data', 'Utils', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions',
	function($scope, $compile, $q, $timeout, $modal, Data, Utils, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {


		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				Data.query().$promise.then(function(data) {
					$scope.data = data
					defer.resolve(data)
				})
				return defer.promise;
	    })
			.withSelect({
				style: 'single'
			})
			.withOption('initComplete', function() {
			})
			.withLanguage(Utils.dataTables_daDk)

		DTDefaultOptions.setLoadingTemplate('<img src="assets/ajax-loader.gif">')

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('data_id').withTitle('#').notVisible(), 
      DTColumnBuilder.newColumn('eksperiment_id').withTitle('#eks.'),
			DTColumnBuilder.newColumn('madding').withTitle('Madding'),
			DTColumnBuilder.newColumn('temp').withTitle('C&deg;'),
			DTColumnBuilder.newColumn('vejr').withTitle('Vejr'),
			DTColumnBuilder.newColumn('sol').withTitle('Sol'),
			DTColumnBuilder.newColumn('vind').withTitle('Vind'),
			DTColumnBuilder.newColumn('myrer_indsamlet').withTitle('Madding'),
			DTColumnBuilder.newColumn('myrer_frysning').withTitle('Madding')
		]

	

  }]);




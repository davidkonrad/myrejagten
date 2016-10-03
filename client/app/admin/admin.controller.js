'use strict';

angular.module('myrejagtenApp')
  .controller('AdminCtrl', ['$scope', '$http', '$q', '$timeout', '$modal', 'Eksperiment', 'Resultat', 'Utils', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions',
	function($scope, $http, $q, $timeout, $modal, Eksperiment, Resultat, Utils, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				$http.get('/api/phddataset/').then(function(res) {
					console.log(res.data)
					$scope.data = res.data
					defer.resolve(res.data)
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
      DTColumnBuilder.newColumn('myrejagt_id').withTitle('Myrejagt ID'),
			/*
      DTColumnBuilder.newColumn('eksperiment_id').withTitle('#eks.'),
			DTColumnBuilder.newColumn('madding').withTitle('Madding'),
			DTColumnBuilder.newColumn('temp').withTitle('C&deg;'),
			DTColumnBuilder.newColumn('vejr').withTitle('Vejr'),
			DTColumnBuilder.newColumn('sol').withTitle('Sol'),
			DTColumnBuilder.newColumn('vind').withTitle('Vind'),
			DTColumnBuilder.newColumn('myrer_indsamlet').withTitle('Madding'),
			DTColumnBuilder.newColumn('myrer_frysning').withTitle('Madding')
			*/
		]

	

  }]);




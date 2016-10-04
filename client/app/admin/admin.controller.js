'use strict';

angular.module('myrejagtenApp')
  .controller('AdminCtrl', ['$scope', '$http', '$q', '$timeout', '$modal', 'Eksperiment', 'Resultat', 'Data', 'Utils', 'ResultatDlg', 'CSV',
		'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions',
	function($scope, $http, $q, $timeout, $modal, Eksperiment, Resultat, Data, Utils, ResultatDlg, CSV,
		DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		$scope.dataById = function(data_id) {
			for (var i=0, l=$scope.data.length; i<l; i++) {
				if ($scope.data[i].data_id == data_id) return $scope.data[i]
			}
			//severe error
		}

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				Data.joinResultat().$promise.then(function(res) {
					$scope.data = res
					defer.resolve(res)
				})
				return defer.promise;
	    })
			.withOption('stateSave', true)
			.withOption('rowCallback', function( row, data, index ) {
				$(row).attr('data_id', data.data_id)
				$(row).addClass( data.resultat_id ? 'success' : 'warning' )
			})
			.withOption('autoWidth', false)
			.withOption('initComplete', function() {
				$('#table-resultat tbody').on('click', 'tr', function() {
					var data_id = $(this).attr('data_id')
					ResultatDlg.show($scope.dataById(data_id), $scope).then(function(changes) {
						if (changes) $scope.dtInstance.rerender()
					})
				})
			})
			.withLanguage(Utils.dataTables_daDk)

		DTDefaultOptions.setLoadingTemplate('<img src="assets/ajax-loader.gif">')

		$scope.dtInstanceCallback = function (instance) {
			$scope.dtInstance = instance;
    }

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('myrejagt_id').withOption('width', '200px').withTitle('Myrejagt ID'),
      DTColumnBuilder.newColumn('eksperiment_dato').withOption('width', '120px').withTitle('Dato'),
      DTColumnBuilder.newColumn('madding').withOption('width', '200px').withTitle('Madding'),
      DTColumnBuilder.newColumn('myrer_indsamlet').withTitle('Indsamlet'),
      DTColumnBuilder.newColumn('myrer_frysning').withTitle('Efter frysning')
		]

/*************
	download
**************/
		$scope.downloadGBIF = function() {
			$http.get('/api/download/gbif/').then(function(res) {
				CSV.download(res.data, 'gbif.csv')
			})
		}



  }]);




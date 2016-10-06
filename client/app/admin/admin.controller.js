'use strict';

angular.module('myrejagtenApp')
  .controller('AdminCtrl', ['$scope', '$http', '$q', '$timeout', 'Resultat', 'Data', 'Utils', 'ResultatDlg', 'CSV', 'MysqlUser',
		'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions',
	function($scope, $http, $q, $timeout, Resultat, Data, Utils, ResultatDlg, CSV, MysqlUser,
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
			})
			.withOption('drawCallback', function() {
				$('#table-resultat tbody tr').off('click').on('click', function() {
					console.log('click')
					var data_id = $(this).attr('data_id')
					ResultatDlg.show($scope.dataById(data_id), $scope).then(function(changes) {
						if (changes) $scope.dtInstance.reloadData()
					})
				})
			})
			.withLanguage(Utils.dataTables_daDk)


		DTDefaultOptions.setLoadingTemplate('<img src="assets/ajax-loader.gif">')

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    }

		function getIcon(data) {
			switch (data) {
				case 0 :
					return '&times;'
					break
				case 1 :
					return '<i class="fa fa-check"></i>'
					break
				default :
					return ''
					break;
			}
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('myrejagt_id').withOption('width', '200px').withTitle('Myrejagt ID'),
      DTColumnBuilder
				.newColumn('eksperiment_dato')
				.withOption('width', '120px')
				.withOption('type', 'dkdato')
				.withTitle('Dato'),
      DTColumnBuilder
				.newColumn('proeve_modtaget')
				.withClass('center')
				.withOption('type', 'dkdato')
				.withTitle('Modtaget'),
      DTColumnBuilder
				.newColumn('proeve_analyseret')
				.withClass('center')
				.withTitle('Analyseret')
				.renderWith(function(data, type, full) {
					return type == 'display' ? getIcon(data) : data
				}),
      DTColumnBuilder.newColumn('madding').withOption('width', '200px').withTitle('Madding'),
      DTColumnBuilder.newColumn('myrer_indsamlet').withTitle('Indsamlet'),
      DTColumnBuilder.newColumn('myrer_frysning').withTitle('Efter frysning')
		]

/*************
	users
**************/
		$scope.dtUserOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				MysqlUser.query().$promise.then(function(res) {
					$scope.users = res
					defer.resolve(res)
				})
				return defer.promise;
	    })
			.withOption('stateSave', true)
			.withOption('rowCallback', function( row, data, index ) {
			})
			.withOption('autoWidth', false)
			.withOption('initComplete', function() {
			})
			.withLanguage(Utils.dataTables_daDk)

		$scope.dtUserColumns = [
      DTColumnBuilder.newColumn('brugernavn').withOption('width', '100px').withTitle('Brugernavn'),
      DTColumnBuilder.newColumn('email').withOption('width', '200px').withTitle('Email'),
      DTColumnBuilder.newColumn('fulde_navn').withOption('width', '200px').withTitle('Navn'),
		]


/*************
	download
**************/
		$scope.downloadGBIF = function() {
			$http.get('/api/download/gbif/').then(function(res) {
				CSV.download(res.data, 'gbif.csv')
			})
		}
		$scope.downloadData = function() {
			$http.get('/api/download/data/0').then(function(res) {
				CSV.download(res.data, 'myrejagten.csv')
			})
		}



  }]);




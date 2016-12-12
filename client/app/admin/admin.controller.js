'use strict';

angular.module('myrejagtenApp')
  .controller('AdminCtrl', ['$scope', '$http', '$q', '$timeout', 'Login', 'Alert', 'Resultat', 'Data', 'Utils', 'ResultatDlg', 'CSV', 'MysqlUser', 'Cnt', 
		'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions',
	function($scope, $http, $q, $timeout, Login, Alert, Resultat, Data, Utils, ResultatDlg, CSV, MysqlUser, Cnt, 
		DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		$scope.test = function() {
			ResultatDlg.show($scope.dataById(1), $scope).then(function(changes) {
				if (changes) $scope.dtInstance.reloadData()
			})
		}

		/*
		//set danish strings for textAngular tooltips
		if (window.taTools) {
			//window.taTools.html.tooltiptext = 'test';
		}
		*/

		$scope.user = Login.currentUser()

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
				//console.log(data);
				$(row).attr('data_id', data.data_id);
				if (data.proeve_analyseret == 1) $(row).addClass('success')
				if (!data.proeve_modtaget) {
					$(row).addClass('danger')
				}
			})
			.withOption('autoWidth', false)
			.withOption('initComplete', function() {
				//$('.dt-button').removeClass('dt-button')

				$scope.check = { a: true, d: true };

				$('.button-toggle')
					.parent()
					.html(''
						+ '<div class="checkbox bg-success button-toggle">'
						+ '  <label class="no-select"><input type="checkbox" id="button-analyzed" checked>Analyserede</label>'
						+ '</div>'
						+ '&nbsp;&nbsp;'
						+ '<div class="checkbox bg-danger button-toggle">'
						+ '  <label class="no-select"><input type="checkbox" id="button-no-data" checked>Mangler belæg</label>'
						+ '</div>'
					);

				$('#button-analyzed').change(function() {
					$scope.check.a = this.checked;
					$scope.dtInstance.DataTable.draw()
				})
				$('#button-no-data').change(function() {
					$scope.check.d = this.checked;
					$scope.dtInstance.DataTable.draw()
				})

				$.fn.dataTable.ext.search.push(function( settings, data, dataIndex, obj ) {
					if (settings.sTableId != 'table-resultat') return true;
					var d = !obj.proeve_modtaget;
					var a = obj.proeve_analyseret == 1;
					if (!$scope.check.d && d) return false;
					if (!$scope.check.a && a) return false;
					return true
				})

				//swap text-right to text-center in <th>'s
				$('th').each(function(i, th) {
					if ($(th).hasClass('text-right')) {
						$(th).removeClass('text-right').addClass('text-center');
					}
				})
			})
			.withOption('drawCallback', function() {
				$('#table-resultat tbody tr').off('click').on('click', function() {
					var data_id = $(this).attr('data_id')
					ResultatDlg.show($scope.dataById(data_id), $scope).then(function(changes) {
						if (changes) $scope.dtInstance.reloadData()
					})
				})
			})
			.withDOM('lBfrtip')
			.withButtons([ 
				{ text : 'test', className: 'Xbutton-toggle' },
				{ extend: 'pdf', className: 'btn btn-sm btn-primary' }  
			])
			.withBootstrap()
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

			/*
      DTColumnBuilder
				.newColumn('proeve_analyseret')
				.withOption('visible', false)
				.withClass('center')
				.withTitle('Analyseret')
				.renderWith(function(data, type, full) {
					return type == 'display' ? getIcon(data) : data
				}),
			*/

      DTColumnBuilder.newColumn('madding')
				.withOption('width', '200px')
				.withTitle('Fødetype'),

      DTColumnBuilder.newColumn('myrer_indsamlet')
				.withOption('class', 'text-right')
				.withTitle('Efter indsamling'),

      DTColumnBuilder.newColumn('myrer_frysning')
				.withOption('class', 'text-right')
				.withTitle('Efter frysning')
		]

/*************
	users
**************/
		$scope.userById = function(user_id) {
			if (!$scope.users) return {}
			for (var i=0, l=$scope.users.length; i<l; i++) {
				if ($scope.users[i].user_id == user_id) return $scope.users[i];
			}
		}

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
			.withOption('displayLength', 50)
			.withOption('rowCallback', function( row, data, index ) {
			})
			.withOption('autoWidth', false)
			.withOption('initComplete', function() {
			})
			.withOption('drawCallback', function() {
				$('.is-admin').off('click').on('click', function(e) {
					var $this = $(this);
					var user_id = $this.attr('user_id');
					var user = $scope.userById(user_id)
					var checked = $this.is(':checked');

					function revert() {
						if (checked) {
							$this.prop('checked', false);
						} else {
							$this.prop('checked', true);
						}
					}

					if (user_id == $scope.user.user_id) {
						revert()
						return Alert.sorry($scope, 'Du kan ikke fratage dig selv admin-rettigheder').then(function() {
							return false
						})
					}

					var q = checked 
						? 'Tildel <em>'+ user.brugernavn + '</em> admin-rettigheder?'
						: 'Fratag <em>'+ user.brugernavn + '</em> admin-rettigheder?';
							
					Alert.confirm($scope, q).then(function(a) {
						if (!a) {
							revert()
						} else {
							MysqlUser.update({ id: user_id }, { is_admin: checked }).$promise.then(function() {
							})
						}
					})
				})
			})
			.withLanguage(Utils.dataTables_daDk)

		$scope.dtUserColumns = [
      DTColumnBuilder.newColumn('brugernavn').withOption('width', '100px').withTitle('Brugernavn'),
	    DTColumnBuilder.newColumn('email').withOption('width', '200px').withTitle('Email'),
      DTColumnBuilder.newColumn('fulde_navn').withOption('width', '200px').withTitle('Fulde navn'),
	    DTColumnBuilder.newColumn('postnr').withOption('width', '100px').withTitle('Postnr.'),
	    DTColumnBuilder.newColumn('kommune').withOption('width', '200px').withTitle('Kommune'),
      DTColumnBuilder.newColumn('is_admin')
				.withOption('width', '50px')
				.withTitle('Admin')
				.renderWith(function(data, type, full) {
					if (type == 'display') {
						return '<input type="checkbox" class="is-admin" user_id="'+ full.user_id +'" ' + (data ? 'checked' : '') +'/>' 
					} else {
						return data
					}
				})

		]

/*************
	content
**************/
		$scope.content = {
			name: undefined,
			content: undefined,
			items: Cnt.getNames()
		}
		
		$scope.$watch('content.name', function(newVal, oldVal) {
			if (newVal != oldVal) {
				Cnt.contentByName(newVal).then(function(value) {
					$scope.content.content = value;
					$scope.content.changed = false;
				})
			}
		}, true)
		$scope.$watch('content.content', function(newVal, oldVal) {
			if (oldVal && newVal != oldVal) {
				$scope.content.changed = true
			}
		}, true)

		$scope.saveContent = function() {
			Cnt.saveContent($scope.content.name, $scope.content.content);
			delete $scope.content.changed;
		}

/*************
	download
**************/
		function getDateStr() {
			var d = new Date();
			return Utils.strPad(d.getDate(), 2) + '-' + Utils.strPad(d.getMonth(), 2) + '-' + d.getFullYear()
		}
			
		$scope.downloadGBIF = function() {
			$http.get('/api/download/gbif/').then(function(res) {
				var fileName = 'gbif_myrejagten_' + getDateStr() + '.csv';
				CSV.download(res.data, fileName)
			})
		}
		$scope.downloadData = function() {
			$http.get('/api/download/all').then(function(res) {
				var fileName = 'myrejagten_' + getDateStr() + '.csv';
				CSV.download(res.data, fileName)
			})
		}



  }]);




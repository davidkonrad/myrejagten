'use strict';

angular.module('myrejagtenApp').controller('AdminDownloadCtrl', 
	['$scope', '$http', '$q', '$timeout', '$cookies', 'Login', 'Utils', 'CSV', 'Cnt', 
	function($scope, $http, $q, $timeout, $cookies, Login, Utils, CSV, Cnt) {

		function logUdtraek(type, fields) {
			var params = {
				userName: $scope.user.brugernavn,
				userEmail: $scope.user.email,
				type: type,
				fields: fields
			}
			$http.post('/api/download/log/', params ).then(function(res) {
				//console.log(res);
			})
		}

		function getDateStr() {
			var d = new Date();
			return Utils.strPad(d.getDate(), 2) + '-' + Utils.strPad(d.getMonth(), 2) + '-' + d.getFullYear()
		}

		function getFields() {
			var inputs = $('form[name="downloadFields"] input[type="checkbox"]:not(.select-all)');
			var fields = {};
			var $input;
			for (var i=0, l=inputs.length; i<l; i++) {
				$input = $(inputs[i]);
				var id = $input.attr('id');
				var checked = $input.is(':checked');
				fields[id] = { checked: checked };
			}
			return fields;
		}

		//check field
		function checkField(fields, fieldName) {
			for (var field in fields) {
				if (field == fieldName) return fields[field].checked
			}
			return true
		}

		//set stored settings, if any
		$timeout(function() {
			var fields = $cookies.get('downloadFields')
			if (fields) {
				fields = JSON.parse(fields);
				for (var field in fields) {
					if (fields[field].checked) {
						$('#'+field).prop('checked', 'checked');
					}
				}
			} else {
				$('form[name="downloadFields"] input[type="checkbox"]:not(.select-all)').each(function() {
					$(this).prop('checked', 'checked');
				})
			}
		});

		//select / deselect all
		$timeout(function() {
			$('form[name="downloadFields"] input.select-all').on('click', function() {
				var checked = $(this).is(':checked');
				var fields = $(this).parent().parent().find('input[type="checkbox"]');
				for (var i=0, l=fields.length; i<l; i++) {
					if (checked) {
						$(fields[i]).prop('checked', 'checked');
					} else {
						$(fields[i]).removeProp('checked');
					}
				}
			});
		});
			
		$scope.downloadGBIF = function() {
			$http.get('/api/download/gbif/').then(function(res) {
				//convert null to ""
				res.data.forEach(function(d) {
					for (var item in d) {
						if (d[item] === null) d[item] = '';
					}
				});
				var fileName = 'gbif_myrejagten_' + getDateStr() + '.csv';
				$timeout(function() {
					CSV.download(res.data, fileName);

					//GDPR udtraek.log
					logUdtraek('UdtraekGBIF', 'user_brugernavn');
				});
			})
		}

		$scope.downloadData = function() {
			var fields = getFields();

			var expireDate = new Date()
			expireDate.setTime(expireDate.getTime()+(1 * 365 * 24 * 60 * 60)); //1 year
			$cookies.put('downloadFields', JSON.stringify(fields), { expires: expireDate } )
			
			$http.get('/api/download/all').then(function(res) {
				var fileName = 'myrejagten_' + getDateStr() + '.csv';

				//filter out not needed fields
				res.data.forEach(function(d) {
					for (var item in d) {
						if (!checkField(fields, item)) delete d[item]
					}
				});

				//convert null to ""
				res.data.forEach(function(d) {
					for (var item in d) {
						if (d[item] === null) d[item] = '';
					}
				});

				$timeout(function() {
					CSV.download(res.data, fileName);

					//GDPR udtraek.log
					var gdpr_fields = [];
					for (var f in fields) {
						if (f.startsWith('user_') && fields[f].checked) gdpr_fields.push(f);
					}
					gdpr_fields = gdpr_fields.length>0 ? gdpr_fields.join(',') : 'Ingen personhenførbare felter';
					logUdtraek('Valgfrit_udtraek', gdpr_fields);

				}, 50);
			})
		}

}]);


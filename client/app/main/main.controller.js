'use strict';

angular.module('myrejagtenApp')
  .controller('MainCtrl', ['$scope', '$compile', '$timeout', '$http', 'MysqlUser', '$modal', 'UploadModal',
	 function($scope, $compile, $timeout, $http, MysqlUser, $modal, UploadModal) {

		/*
		$http.get('/api/download/gbif/').then(function(res) {
			console.log(res.data)
			//$scope.test(res.data)
		})
		*/

		$scope.test = function(data) {

			function values(x) {
				var r = [];
				for (var prop in x) {
					if (x.hasOwnProperty(prop)) r.push(x[prop])
				}
				return r
			}

			var row = data[0];
			var csv = [];
			//header, csv names
			csv.push(Object.keys(row))

			for (var i in data) {
				csv.push(values(data[i]))
			}

			var csvRows = [];
			for(var i=0, l=csv.length; i<l; ++i){
		    csvRows.push(csv[i].join(','));
			}
			var csvString = csvRows.join("\n");

			$timeout(function() {
				var a = document.createElement('a');
				a.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
				a.target = '_blank';
				a.download = 'dnaogliv.csv';

				document.body.appendChild(a);
				a.click();
			})
		}	

  }]);

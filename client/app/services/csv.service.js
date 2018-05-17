'use strict';

angular.module('myrejagtenApp')
	.factory('CSV', function($timeout) {
	return {
		download: function(data, fileName) {

			function values(x) {
				var r = [];
				for (var prop in x) {
					if (x.hasOwnProperty(prop)) r.push('"'+ x[prop] +'"')
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
				var blob = new Blob([csvString], {type: 'text/csv'});
				var a = document.createElement('a');
				a.href = window.URL.createObjectURL(blob);
				a.target = '_blank';
				a.download = fileName;

				document.body.appendChild(a);
				a.click();
				if (a.remove) a.remove();	//should polyfill if lack of support(?)
			})
		}	
	}

});


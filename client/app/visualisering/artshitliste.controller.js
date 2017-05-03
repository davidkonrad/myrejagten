'use strict';

angular.module('myrejagtenApp')
  .controller('ArtshitlisteCtrl', ['$scope', '$http', function($scope, $http) {

		var getInfo = function(navn_videnskabeligt) {
			for (var i=0, l=$scope.sorted_results.length; i<l;i++) {
				if ($scope.sorted_results[i].navn_videnskabeligt == navn_videnskabeligt) {
					return $scope.sorted_results[i];
				}
			}
			//should never happen
			return ''
		};

		$scope.options = {
			defaultColor: '#000',
			defaultFontWeight: 'bold',
			defaultFontColor: '#000',
			defaultFontFamily: '"noto sans",arial,sans-serif',
			elements: {
				line: {
					borderColor: '#000'
				}
			},
	 		tooltips: {
		    enabled: true,
		    mode: 'single',
		    callbacks: {
		      label: function(tooltipItem, data) {
		        var label = data.labels[tooltipItem.index];
		        var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

						var info = getInfo(tooltipItem.yLabel);
						var eks = datasetLabel == 1 ? ' eksperiment. ' : ' eksperimenter. '
						return info.navn_dk + ' Fundet i' + datasetLabel + eks + info.fundne_myrer +' dyr registreret i alt.';
		      }
		    }
			},
			barShowStroke: false,
			animation: false,
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false,
						color:  '#000',
					},
					ticks: {}
				}],
				yAxes: [{
					gridLines: {
						display: false,
						color:  '#000',
					},
					position: "right",
				}]
			},
		};

		$http.get('api/stats/arterGetTotal').then(function(result) {
		
			var r, eks = {};
			for (var i=0, l=result.data.length; i<l; i++) {
				r = result.data[i];
				if (eks[r.navn_videnskabeligt]) {
	 				eks[r.navn_videnskabeligt].antal_eksperimenter++;
	 				eks[r.navn_videnskabeligt].fundne_myrer += r.antal;
				} else {
					eks[r.navn_videnskabeligt] = { 
						antal_eksperimenter: 1, 
						fundne_myrer: r.antal,
						navn_dk: r.navn_dk 
					};
				}

				if (i==l-1) {
					var keys = Object.keys(eks);	
					var sortable = [];
					var item;
					keys.forEach(function(k) {
						var item = eks[k];
						item.navn_videnskabeligt = k;
						sortable.push(item);
					})
					sortable.sort(function(a, b) {
						return b.antal_eksperimenter - a.antal_eksperimenter;
					});

					$scope.colors = [];
					$scope.data = [];
					$scope.labels = [];

					sortable.forEach(function(s) {
						$scope.data.push(s.antal_eksperimenter);
						$scope.labels.push(s.navn_videnskabeligt);
						$scope.colors.push({
					    backgroundColor: 'rgb(190,190,190)',
					    hoverBackgroundColor: 'rgb(190,190,190)',
					    hoverBorderColor: 'rgb(190,190,190)',
			        pointBackgroundColor: 'rgb(190,190,190)'
						});
					})

					$scope.options.scales.xAxes[0].ticks = {
						max: sortable[0].antal_eksperimenter,
						beginAtZero: true,
						steps: 5,
						stepValue: 15,
						callback: function(value, index, values) {
							//skip decimals
							if (value % 1 != 0) return '';
							//skip second last index
							return index == values.length-2 ? null : value
						}
					};

					//used by getInfo
					$scope.sorted_results = sortable;
				}
			}

		})

}]);

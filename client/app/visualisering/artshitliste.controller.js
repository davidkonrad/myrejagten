'use strict';

angular.module('myrejagtenApp')
  .controller('ArtshitlisteCtrl', ['$scope', '$http', function($scope, $http) {

		var getNavnDk = function(navn_videnskabeligt) {
			for (var i=0, l=$scope.result.data.length; i<l;i++) {
				if ($scope.result.data[i].navn_videnskabeligt == navn_videnskabeligt) return $scope.result.data[i].navn_dk
			}
			return ''
		}

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
						//console.log(data)
		        var label = data.labels[tooltipItem.index];
		        var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						return getNavnDk(tooltipItem.yLabel) + '   ' + datasetLabel + ' registeringer';
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


					/*
	        scaleLabel: {
	          display: true,
	          labelString: "Registrerede myre-arter",
	        }
					*/	
				}]
			},
		};


		$http.get('api/stats/arterGetTotal').then(function(result) {
		
			$scope.result = result;

			$scope.colors = [];
			$scope.data = [];
			$scope.labels = [];

			result.data.forEach(function(a) {
				$scope.data.push(a.antal);
				$scope.labels.push(a.navn_videnskabeligt);
				$scope.colors.push({
			    backgroundColor: 'rgb(190,190,190)',
			    XborderColor: 'rgb(190,190,190)',
			    hoverBackgroundColor: 'rgb(190,190,190)',
			    hoverBorderColor: 'rgb(190,190,190)',
	        pointBackgroundColor: 'rgb(190,190,190)',
	        XpointHoverBackgroundColor: 'rgb(190,190,190)',
				})
			})

			$scope.options.scales.xAxes[0].ticks = {
				max: result.data[0].antal,
				beginAtZero: true,
				steps: 5,
				stepValue: 15,
				callback: function(value, index, values) {
					//skip second last index
					return index == values.length-2 ? null : value
				}
			};


		})

  }]);

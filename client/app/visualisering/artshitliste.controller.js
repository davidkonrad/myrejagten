'use strict';

angular.module('myrejagtenApp')
  .controller('ArtshitlisteCtrl', ['$scope', '$http', function($scope, $http) {

		var getInfo = function(navn_dk) {
			for (var i=0, l=$scope.results.length; i<l;i++) {
				if ($scope.results[i].navn_dk == navn_dk) {
					return $scope.results[i];
				}
			}
			//recycle, if navn_dk is empty and is been overwritten with navn_videnskabeligt
			for (var i=0, l=$scope.results.length; i<l;i++) {
				if ($scope.results[i].navn_videnskabeligt == navn_dk) {
					return $scope.results[i];
				}
			}
			return ''
		};

		$scope.options = {
			defaultColor: '#000',
			defaultFontWeight: 'bold',
			defaultFontSize: 20, //
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
		        var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						var info = getInfo(tooltipItem.yLabel);
						var eks = datasetLabel == 1 ? ' eksperiment. ' : ' eksperimenter. '
						var label = [];
						label.push(info.navn_videnskabeligt+"\t" || tooltipItem.yLabel); //avoid undefined on certain species
						label.push('Fundet i ' + datasetLabel + eks);
						label.push('Fundet i ' + info.antal_madding + ' fødevalg');
						var fundne = info.antal_dyr || '?';
						label.push(fundne +' dyr registreret i alt.');
						return label;
		      }
		    }
			},
			maintainAspectRatio: false,
			barShowStroke: false,
			animation: false,
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false,
						color:  '#a0a0a0'
					},
					ticks: {},
					scaleLabel: {
		        display: true,
		        labelString: 'Antal eksperimenter'
		      }
				}],
				yAxes: [{
					barThickness: 25,
					ticks: {
						fontSize: 16
					},
					gridLines: {
						display: false,
						color: '#a0a0a0'
					},
					position: "right"
				}]
			}
		};

		$http.get('api/stats/arterGetTotal').then(function(result) {
			$scope.results = result.data;
			$scope.colors = [];
			$scope.data = [];
			$scope.labels = [];

			result.data.forEach(function(r) {
				$scope.data.push(r.antal_eksperimenter);
				$scope.labels.push(r.navn_dk || r.navn_videnskabeligt || '<ikke sat>');
				$scope.colors.push({
			    backgroundColor: 'rgb(190,190,190)',
			    hoverBackgroundColor: 'rgb(190,190,190)',
			    hoverBorderColor: 'rgb(190,190,190)',
		      pointBackgroundColor: 'rgb(190,190,190)'
				});
			})
		})


}]);

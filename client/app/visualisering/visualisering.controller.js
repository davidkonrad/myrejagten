'use strict';

angular.module('myrejagtenApp')
  .controller('VisualiseringCtrl', 
	function($scope, $http, $timeout, Login, TicketService, Eksperiment, Utils) {


		$scope.charts = [];
		$scope.user = Login.currentUser();

		$scope.eksperimenter = [];
		$scope.selected = { eksperiment : '' };

	  $scope.datasetOverride = [{
	    backgroundColor: 'rgb(0,109,219)',
	    borderColor: 'rgb(0,109,219)',
	    hoverBackgroundColor: 'rgb(0,109,219)',
	    hoverBorderColor: 'rgb(0,109,219)'
	  }, {
	    backgroundColor: 'rgb(197,94,91)',
	    borderColor: 'rgb(197,94,91)',
	    hoverBackgroundColor: 'rgb(197,94,91)',
	    hoverBorderColor: 'rgb(197,94,91)'
	  }, {
	    backgroundColor: 'rgb(190,190,190)',
	    borderColor: 'rgb(190,190,190)',
	    hoverBackgroundColor: 'rgb(190,190,190)',
	    hoverBorderColor: 'rgb(190,190,190)'
	  }];

 		Chart.defaults.global.tooltips.displayColors = false;
		Chart.defaults.global.defaultFontColor = '#000';
		Chart.defaults.global.defaultFontFamily = '"noto sans",arial,sans-serif';
		Chart.defaults.global.elements.line.borderColor = '#000';
		Chart.defaults.global.elements.line.backgroundColor = '#000';

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
						return datasetLabel+'%';
		      }
		    }
			},
			barShowStroke: false,
			animation: false,
			legend: {
				display: true,
				position: 'right'
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					},
					scaleLabel: {
		        display: true,
		        labelString: 'Fødetyper'
		      }
				}],
				yAxes: [{
					gridLines: {
						display: false
					},
					scaleLabel: {
		        display: true,
		        labelString: '% af antal myrer efter frysning'
		      }
				}]
			},
		};

		$scope.ratioLabels = ['Vand', 'Sukkervand', 'Saltvand', 'Olie', 'Protein', 'Kammerjunker'];

		if ($scope.user) {
		  $scope.ratioSeries = ['Eksperiment', 'Mine eksperimenter', 'Alle eksperimenter'];
			$scope.ratioData = [[],[],[]];

			Eksperiment.query({ where : { user_id: $scope.user.user_id }}).$promise.then(function(eksperimenter) {
				eksperimenter.forEach(function(eks) {
					$scope.eksperimenter.push({
						label: eks.myrejagt_id+ '  ' + eks.titel,
						value: eks.eksperiment_id
					})
				})
			})
			$http.get('api/stats/ratioGetTotal').then(function(result) {
				$scope.ratioLabels.forEach(function(m) {
					$scope.ratioData[0].push(0);
					$scope.ratioData[2].push(result.data[m+'Ratio']);
				})
			})
			$http.get('api/stats/ratioGetTotalUser', { params : { user_id: $scope.user.user_id }} ).then(function(result) {
				$scope.ratioLabels.forEach(function(m) {
					$scope.ratioData[1].push(result.data[m+'Ratio']);
				})
			})
			$scope.eksperimentChange = function() {
				$http.get('api/stats/ratioGetEksperiment', { params : { eksperiment_id: $scope.selected.eksperiment }} ).then(function(result) {
					$scope.ratioData[0] = [];
					$scope.ratioLabels.forEach(function(m) {
						$scope.ratioData[0].push(result.data.eksperiment[m+'Ratio']);
					})
				})
			}

		} else {
			$scope.ratioData = [[]];
		  $scope.ratioSeries = ['Alle eksperimenter'];

			$http.get('api/stats/ratioGetTotal').then(function(result) {
				$scope.ratioLabels.forEach(function(m) {
					$scope.ratioData[0].push(result.data[m+'Ratio']);
				})
			})

		}
			
});

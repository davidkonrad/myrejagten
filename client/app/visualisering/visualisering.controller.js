'use strict';

angular.module('myrejagtenApp')
  .controller('VisualiseringCtrl', ['$scope', '$http', '$timeout', 'Login', 'TicketService', 'Eksperiment', 'Utils',
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

 		//console.dir(Chart.defaults.global)
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
		        //return label + ': ' + datasetLabel + '%';
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
			      //fontSize: 14,
		        display: true,
		        labelString: '% af antal myrer efter frysning'
		      }
				}]
			},
		};

		$scope.ratioLabels = ['Vand', 'Saltvand', 'Sukkervand', 'Olie', 'Protein', 'Kammerjunker'];

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

		/**
			arter
		*/
		$scope.arterOptions = {
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
		        //return label + ': ' + datasetLabel + '%';
						return datasetLabel+'%';
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
						color:  'gray',
					},
				}],
				yAxes: [{
					gridLines: {
						display: false,
						color:  'gray',
					},
				}]
			},
		};

	  $scope.arterOverride = [{
	    backgroundColor: 'rgb(190,190,190)',
	    borderColor: 'rgb(190,190,190)',
	    hoverBackgroundColor: 'rgb(190,190,190)',
	    hoverBorderColor: 'rgb(190,190,190)'
	  }];

		$http.get('api/stats/arterGetTotal').then(function(result) {
			$scope.arterData = [];
			$scope.arterLabels = [];
			result.data.forEach(function(a) {
				$scope.arterData.push(a.antal);
				$scope.arterLabels.push(a.navn);
			})
		})


/*****************************************/
		$scope.map = {
			events: {
				map: {
					enable: ['zoomstart', 'drag', 'click', 'dblclick', 'mouseover'],
					logic: 'emit'
				}
			},
			markers: [],
			center: {
				lat: 56.126627523318206,
				lng: 11.457741782069204,
				zoom: 7
			},
			defaults: {
				zoomAnimation: true,
				markerZoomAnimation: true,
				fadeAnimation: true,
				tileLayerOptions: {
					detectRetina: true,
					reuseTiles: true
				}
			},
			layers: {
        baselayers: {
					googleTerrain: {
				    name: 'Google Terrain',
				    layerType: 'TERRAIN',
				    type: 'google',
						visible: true,
						layerOptions: {
							mapOptions: {
								styles: DefaultGoogleStyles
						  }
						}
					},
					googleHybrid: {
				    name: 'Google Hybrid',
				    layerType: 'HYBRID',
				    type: 'google',
						visible: false
				  },
					luftfoto: {
						name: "Orto forår (luffoto)",
						type: 'wms',
						url: "http://kortforsyningen.kms.dk/topo_skaermkort",
						layerOptions: {
							layers: "orto_foraar",
							servicename: "orto_foraar",
							version: "1.1.1",
							request: "GetMap",
							format: "image/jpeg",
							service: "WMS",
							styles: "default",
							exceptions: "application/vnd.ogc.se_inimage",
							jpegquality: "80",
							attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
							ticket: TicketService.get()
						}
					}
				}
			}
		}

		$scope.$on('leafletDirectiveMarker.mouseover', function(e, marker) {
			marker.leafletObject.openPopup()
		})

		Eksperiment.query().$promise.then(function(eksperimenter) {
			function getData(e) {
					if (!e.Data || !e.Data.length) return ''
				var d = '<table style="width:200px;line-height:14px;">';
				for (var i=0, l=e.Data.length; i<l; i++) {
					if (e.Data[i].maden_stjaalet || e.Data[i].myrer_indsamlet || e.Data[i].myrer_frysning) {
						d+= '<tr>';
						d+= '<td>' + e.Data[i].madding +'</td>';
						d+= '<td>' + (e.Data[i].maden_stjaalet == '1' ? '&times;' : '') +'</td>';
						d+= '<td>' + (typeof e.Data[i].myrer_indsamlet == 'number' ? e.Data[i].myrer_indsamlet : '0') + '</td>';
						d+= '<td>' + (typeof e.Data[i].myrer_frysning == 'number' ? e.Data[i].myrer_frysning : '0') + '</td>';
						d+= '</tr>'
					}
 				}
				d+='</table>'
				return d
			}				
			function getMessage(e) {
				//console.log(e)
				var data = getData(e)
				var titel = e.titel.trim() != '' ? e.titel : e.adresse

				var vejr = [];
				if (e.sol) vejr.push(e.sol);
				if (e.vejr) vejr.push(e.vejr);
				if (e.vind) vejr.push(e.vind);
				if (e.temp) vejr.push(e.temp + '&deg;');
				var m = '<h4>' + titel + '</h4>';
				m+= vejr.length>0 ? '<p style="margin: 0px;font-weight:bold;">' + vejr.join(', ') + '</p>' : '';
				m+= data;
				m+= e.upload_billede ? '<img src="' + e.upload_billede + '" style="width: 290px;">' : '';

				return m
			}
			eksperimenter.forEach(function(e) {
				if (e.lat && e.lng) $scope.map.markers.push({
					lat: parseFloat(e.lat),
					lng: parseFloat(e.lng),
					message: getMessage(e),
					/*	
					icon: {
						type: "awesomeMarker",
						prefix: 'fa',
  		      icon: "trophy",
  		      markerColor: "blue"
  			  }
					*/
				})
			})
		})
			
	
					
				
		

  }]);

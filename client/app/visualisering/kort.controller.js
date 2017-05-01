'use strict';

angular.module('myrejagtenApp')
  .controller('KortCtrl', ['$scope', '$http', '$timeout', 'Login', 'TicketService', 'Eksperiment', 'Utils',
	 function($scope, $http, $timeout, Login, TicketService, Eksperiment, Utils) {


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
		};

		$scope.$on('leafletDirectiveMarker.click', function(e, marker) {
			marker.leafletObject.openPopup()
		});

		Eksperiment.query().$promise.then(function(eksperimenter) {
			function getData(e) {
					if (!e.Data || !e.Data.length) return ''
				var d = '<table style="width:180px;line-height:14px;">';
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
				var data = getData(e);
				var titel = e.titel.trim() != '' ? e.titel : e.adresse;

				var m = '<h4>' + e.myrejagt_id + ' | ' + titel + '</h4>';
				m+='Udført af: <strong><small>'+ e.User.brugernavn + '</small></strong> d.' +Utils.fixDate(e.dato)+'<br>';

				var vejr = [];
				if (e.sol) vejr.push(e.sol);
				if (e.vejr) vejr.push(e.vejr);
				if (e.vind) vejr.push(e.vind);
				if (e.temp) vejr.push(e.temp + '&deg;');


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
				})
			})
		})

}]);

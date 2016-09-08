'use strict';

angular.module('myrejagtenApp')
  .directive('adresseOpslag', function($parse, TicketService) {
    return {
      restrict: 'A',
			link: function(scope, element, attrs) {

        var eksperiment_id = attrs['eksperimentId'],
						adresseType = attrs['adresseType'],
						value = attrs['onSelect'], 
						onSelect = scope[value] ? scope[value] : null;

				function initialize() {
					$(element).typeahead('destroy')

					$(element).typeahead({
						displayText: function(item) {
							switch (attrs.adresseType) {
								case 'stednavne_v2' : 
									return item.presentationString
									break
								case 'adresser' :
									return item.presentationString
									break
								default :
									return null
							}
						},
						afterSelect: function(item) {
							if (onSelect) onSelect(eksperiment_id, adresseType, item)
						}, 
						items : 20,
						source: function(query, process) {
							switch (attrs.adresseType) {
								case 'adresser' :
									var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=adresser&crs=EPSG:4326&limit=100&ticket='+TicketService.get()
									break;
								//stednavne_v2 does not support EPSG:4326
								case 'stednavne_v2' :
									var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=stednavne_v2&limit=100&ticket='+TicketService.get()
									break;
								default :
									break;
							}
							/*
							if (!method) return
							var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources='+method+'&crs=EPSG:4326&limit=100&ticket='+TicketService.get()
							*/
					    return $.getJSON(url, function(resp) {
								var data = [], caption = '';
								for (var i in resp.data) {
									data.push(resp.data[i]);
								}			
								return process(data);		
					    })
						}
					})
				}

				attrs.$observe('adresseType', function(value) {
					adresseType = value
					initialize()
				})

			}
		}
});

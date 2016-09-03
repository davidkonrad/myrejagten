'use strict';

angular.module('myrejagtenApp')
  .directive('adresseOpslag', function($parse, TicketService) {
    return {
      restrict: 'A',
			scope : {
				adresseType : '@',
			},
			link: function(scope, element, attrs) {

				function initialize() {
					$(element).typeahead('destroy')
					$(element).typeahead({
						displayText: function(item) {
							console.log(item)
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
							console.log(item)
							scope.taxon.Videnskabeligt_navn = item.Videnskabeligt_navn;
							scope.taxon.Dansk_navn = item.Dansk_navn;
							scope.$apply()
						}, 
						items : 20,
						source: function(query, process) {
							var method = attrs.adresseType
							if (!method) return
							var url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources='+method+'&limit=100&ticket='+TicketService.get()
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
					initialize()
				})

			}
		}
});

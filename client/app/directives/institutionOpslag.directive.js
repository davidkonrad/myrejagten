'use strict';

angular.module('myrejagtenApp')
	.directive('institutionOpslag', function(TicketService) {
    return {

      restrict: 'A',
			link: function(scope, element, attrs) {
        var afterSelect = attrs['institutionOpslag'] || null;
				afterSelect = afterSelect && scope[afterSelect] ? scope[afterSelect] : null;

				$(element).typeahead('destroy')

				$(element).typeahead({
					items : 20,
					afterSelect: function(item) {
						if (afterSelect) afterSelect(item)
					}, 
					displayText: function(item) {
						return item.presentationString
					},
					source: function(query, process) {
						var types = ['gymnasium', 'uddannelsescenter', 'privatskoleFriskole', 'folkeskole', 
													'universitet', 'specialskole', 'daginstitution', 'fagskole' ];

						var url = 'https://services.kortforsyningen.dk/Geosearch?search=*'+query+'*&resources=stednavne_v2,postdistrikter&limit=300&ticket='+TicketService.get()
						return $.getJSON(url, function(resp) {
							var newData = [];
							for (var i in resp.data) {
								if (~types.indexOf(resp.data[i].type) || ~types.indexOf(resp.data[i].subtype)) {
									newData.push(resp.data[i]);
								} else {
									//console.log(resp.data[i].type)
								}
							}			
							return process(newData);		
				    })
				  }
				})
			}
		}

})

'use strict';

angular.module('myrejagtenApp').
	directive('postnrOpslag', function(PostNr) {
    return {
      restrict: 'A',
			link: function(scope, element, attrs) {
        var as = attrs['afterSelect'];
				var	afterSelect = scope[as] ? scope[as] : null;
				var postnr = PostNr.get();

				$(element).typeahead({
					displayText: function(item) {
						return item.nr + ' ' + item.navn
					},
					afterSelect: function(item) {
						if (afterSelect) afterSelect(item)
					}, 
					items : 20,
					source: postnr
				})
			}
		}

});



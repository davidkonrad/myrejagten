'use strict';

angular.module('myrejagtenApp')
  .directive('mjContent', function($compile, Cnt) {
    return {
      restrict: 'A',
			replace: false,
      link: function link(scope, element, attrs) {
				var contentName = attrs['mjContent'] ? attrs['mjContent'] : 'undefined';

				Cnt.contentByName(contentName).then(function(content) {
					if (!content) content = '<div class="circle">' + contentName + '</div>';
					element.replaceWith(content);			
				})

	    }
    };
  })



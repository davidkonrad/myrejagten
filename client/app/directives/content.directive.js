'use strict';

angular.module('myrejagtenApp')
  .directive('mjContent', function($compile, Cnt) {
    return {
      restrict: 'A',
			replace: false,
      link: function link(scope, element, attrs) {
				var contentName = attrs['mjContent'] ? attrs['mjContent'] : 'undefined';

				Cnt.contentByName(contentName).then(function(content) {
					if (content == undefined || content == '') {
						content = '<div class="circle">' + contentName + '</div>';
					} else if (content == '.') {
						content == '';
					}
					element.replaceWith(content);			
				});

	    }
    };
  });


'use strict';

angular.module('myrejagtenApp')
  .directive('mjContent', function($compile, Cnt) {
    return {
      restrict: 'A',
			replace: false,
      link: function link(scope, element, attrs) {
				console.log('ok')
				var contentName = attrs['mjContent'] ? attrs['mjContent'] : 'undefined';
				var content = Cnt.contentByName(contentName);

				console.log(contentName, content)
				if (!content) content = '<div class="circle">' + contentName + '</div>';

				//var e = $compile(content)(scope);
				element.replaceWith(content);			

      }
    };
  })



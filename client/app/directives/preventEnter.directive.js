'use strict';

angular.module('myrejagtenApp')
	.directive('preventKeyboardEnter', function() {
		return {
			link: function(scope, element, attrs) {
				element.keypress(function(e) {
					if (e.keyCode == 13) {
						e.preventDefault();
						return;
					}
				});
			}
		}
	});

'use strict';

/**
	service for handling content strings 
	from /Content 
*/

angular.module('myrejagtenApp')
  .factory('Cnt', function($timeout, Content) {

		var content = null;
		var contentNames = [];

		return {
			init: function() {
				Content.query().$promise.then(function(cnt) {
					content = cnt;

					contentNames = [];
					cnt.forEach(function(item) {
						contentNames.push(item.name)
					})
					$timeout(function() {
						contentNames.sort()
					})
				})
			},

			getNames: function() {
				return contentNames
			},

			saveContent: function(name, newContent) {
				for (var i=0, l=content.length; i<l; i++) {
					if (content[i].name == name ) {
						content[i].content = newContent
						Content.update({ id: content[i].content_id }, { content: newContent }).$promise.then(function() {
						})
					}
				}
			},
				
			contentByName: function(name) {
				for (var i=0, l=content.length; i<l; i++) {
					if (content[i].name == name ) return content[i].content
				}
				return false
			}
				
		}
});

//initialize
angular.module('myrejagtenApp').run(function(Cnt) {
	Cnt.init()
});



'use strict';

/**
	service for handling content strings 
	from /Content 
*/

angular.module('myrejagtenApp')
  .factory('Cnt', function($timeout, $q, Content) {

		var content = null;
		var contentNames = [];
		var empty = '__empty__';

		function loadContent() {
			var	deferred = $q.defer();
			Content.query().$promise.then(function(cnt) {
				content = cnt;
				contentNames = [];

				//populate contentNames (used by dropdown menu)
				cnt.forEach(function(item) {
					contentNames.push(item.name)
				})

				//alpha sort content
				$timeout(function() {
					contentNames.sort()
				})

	      deferred.resolve(true)
			})
      return deferred.promise;
		}

		return {
			init: function() {
				loadContent()
			},

			getNames: function() {
				return contentNames
			},

			saveContent: function(name, newContent) {
				console.log('save' + newContent + 'save', newContent.length)
				for (var i=0, l=content.length; i<l; i++) {
					if (content[i].name == name ) {
						if (newContent != '' && newContent.trim() == '') newContent = empty;
						content[i].content = newContent
						Content.update({ id: content[i].content_id }, { content: newContent }).$promise.then(function() {
						})
					}
				}
			},
				
			contentByName: function(name) {

				function getValue() {
					for (var i=0, l=content.length; i<l; i++) {
						if (content[i].name == name ) {
							return content[i].content; // == empty ? content[i].content : '  ';
						}
					}
				}

				var	deferred = $q.defer();
				if (!content) {
					loadContent().then(function() {
			      deferred.resolve(getValue())
					})
				} else {
		      deferred.resolve(getValue())
				}

	      return deferred.promise;
			}
				
		}
});

//initialize
angular.module('myrejagtenApp').run(function(Cnt) {
	Cnt.init()
});



'use strict';

angular.module('myrejagtenApp')
  .factory('Content', function ($resource) {
    
	  return $resource('/api/content/:id', { id: '@content_id' }, {
			update: {
				method: 'PUT' 
			}
		})
   
  });

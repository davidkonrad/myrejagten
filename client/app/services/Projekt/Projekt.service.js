'use strict';

angular.module('myrejagtenApp')
  .factory('Projekt', function ($resource) {
    
    // Public API here
	  return $resource('/api/projekt/:id', { id: '@projekt_id' }, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
   
  });

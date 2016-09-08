'use strict';

angular.module('myrejagtenApp')
  .factory('Data', function ($resource) {
    
    // Public API here
	  return $resource('/api/data/:id', { id: '@data_id' }, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
   
  });

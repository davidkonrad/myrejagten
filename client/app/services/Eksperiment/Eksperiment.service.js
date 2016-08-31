'use strict';

angular.module('myrejagtenApp')
  .factory('Eksperiment', function ($resource) {
    
    // Public API here
	  return $resource('/api/eksperiment/:id', { id: '@eksperiment_id' }, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
   
  });

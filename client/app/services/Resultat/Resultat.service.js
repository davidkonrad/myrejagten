'use strict';

angular.module('myrejagtenApp')
  .factory('Resultat', function ($resource) {
    
	  return $resource('/api/resultat/:id', { id: '@resultat_id' }, {
			update: {
				method: 'PUT'
			}
		});
   
  });

'use strict';

angular.module('myrejagtenApp')
  .factory('Data', function ($resource) {
    
	  return $resource('/api/data/:id', { id: '@data_id' }, {
			update: {
				method: 'PUT' 
			},
			joinResultat: {
				method: 'GET',
				url: '/api/data/resultat',
				isArray: true
			}
		})
   
  });

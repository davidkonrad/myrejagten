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
			},
			stats: {
				method: 'GET',
				url: '/api/data/stats',
				isArray: true
			}
		})
   
  });

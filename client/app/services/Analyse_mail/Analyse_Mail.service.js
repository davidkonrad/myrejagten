'use strict';

angular.module('myrejagtenApp')
  .factory('Analyse_mail', function ($resource) {
    
    // Public API here
	  return $resource('/api/analyse_mail/:id', { id: '@analyse_mail_id' }, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
   
  });

'use strict';

angular.module('myrejagtenApp')
  .factory('MysqlUser', function ($resource) {
    
    // Public API here
	  return $resource('/api/mysqluser/:id', { id: '@user_id' }, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
   
  });

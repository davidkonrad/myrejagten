'use strict';

angular.module('myrejagtenApp')
  .factory('Login', ['$cookies', '$q', 'MysqlUser', function($cookies, $q, MysqlUser) {
    
	var cookieName = 'myrejagten', 
			currentUser = null;

	function setCookie(s) {
		var expireDate = new Date()
		expireDate.setTime(expireDate.getTime()+(2*60*60*1000)) //two hours
		$cookies.put(cookieName, s, { expires: expireDate } )
	}
	function deleteCookie() {
		$cookies.remove(cookieName)
	}


	return {

		login: function(email, password) {
			var deferred = $q.defer()
			deleteCookie()
			MysqlUser.query({ where : { email: email, password: password }}).$promise.then(function(response) {
				if (response[0] && response[0].user_id) {
					currentUser = response[0]
					setCookie('HGs%sdf123b57nDdss5') //...
		      deferred.resolve(response[0])
				} else {
					deferred.resolve({ error : 'Email eller password ikke korrekt.' })
				}	
			})	
			return deferred.promise;
		},

		logout: function() {
			currentUser = null
			deleteCookie()
		},
						
		isLoggedIn: function() {
			return $cookies.get(cookieName) != null
		},

		currentUser: function() {
			return currentUser
		}


	}

}]);
   


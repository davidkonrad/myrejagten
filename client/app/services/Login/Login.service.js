'use strict';

angular.module('myrejagtenApp')
  .factory('Login', ['$cookies', '$q', 'MysqlUser', 'RememberMe', function($cookies, $q, MysqlUser, RememberMe) {
    
	var cookieName = 'myrejagten', 
			currentUser = null;

	function setCookie(user) {
		var expireDate = new Date()
		expireDate.setTime(expireDate.getTime()+(2*60*60*1000)) //two hours
		$cookies.put(cookieName, JSON.stringify(user), { expires: expireDate } )
	}
	function deleteCookie() {
		$cookies.remove(cookieName)
	}

	return {

		login: function(email, password, rememberMe) {
			var deferred = $q.defer()
			deleteCookie()
			MysqlUser.query({ where : { email: email, password: password, confirmed: true }}).$promise.then(function(response) {
				if (response[0] && response[0].user_id) {
					currentUser = response[0]
					setCookie(currentUser) //...
					RememberMe.put(email, password, rememberMe);
		      deferred.resolve(response[0])
				} else {
					deferred.resolve({ error : 'Email eller password ikke korrekt.' })
				}	
			})	
			return deferred.promise;
		},

		logout: function() {
			currentUser = null;
			deleteCookie()
		},
						
		isLoggedIn: function() {
			if (currentUser) {
				return true
			} else {
				var s = $cookies.get(cookieName)
				if (s) {
					currentUser = JSON.parse(s)
					setCookie(currentUser) //force update of expire					
					return true
				}
			}
			return false
		},

		updateCookie: function() {
			if (typeof currentUser.user_id != 'number') return
			MysqlUser.query({ where : { user_id: currentUser.user_id }}).$promise.then(function(response) {
				currentUser = response[0];
				setCookie(currentUser); //...
			})	
		},

		isAdmin : function() {
			if (!currentUser) return false;
			return currentUser.is_admin ? currentUser.is_admin : false
		},

		currentUser: function() {
			return currentUser
		}


	}

}]);
   


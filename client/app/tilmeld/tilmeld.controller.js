'use strict';

angular.module('myrejagtenApp')
  .controller('TilmeldCtrl', ['$scope', '$http', '$location', 'MysqlUser', 'Login', 'Utils',
	function($scope, $http, $location, MysqlUser, Login, Utils) {


/*
				$http.post('api/email/signup/', { id: 4 }).then(function(response) {
					$scope.processed = response.data ? response.data : ''
					console.log(response)
				})	
*/


  	MysqlUser.query().$promise.then(function(users) {
			$scope.users = users
		})

		$scope.user = {
			role: 1
		}

		$scope.generatePassword = function() {
			$scope.user.password = Utils.generateHash(10)
		}			

		//from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		$scope.emailIsValid = function() {
			if (!$scope.user.email) return true
	    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return regex.test($scope.user.email)
		}

		$scope.emailInUse = function() {
			if (!$scope.users) return
			if (!$scope.user.email) return 
			for (var i=0, l=$scope.users.length; i<l; i++) {
				if ($scope.users[i].email == $scope.user.email) {
					return true
				}
			}
			return false
		}
		
		$scope.canCreateUser = function() {
			return $scope.user.brugernavn && $scope.user.brugernavn.length>2 
						 && $scope.user.email && $scope.user.email.length>2 &&	$scope.emailIsValid($scope.user.email) 	
						 && $scope.user.password && $scope.user.password.length>2 
						 && $scope.user.termsAccepted

		}

		$scope.createUser = function() {
			$scope.user.hash = Utils.generateHash(20);
			MysqlUser.save({ user_id: ''}, $scope.user).$promise.then(function(user) {

				console.log(user)
				$http.post('api/email/signup/', { id: user.user_id }).then(function(response) {
					$scope.processed = response.data ? response.data : ''
					console.log(response)
				})	


			})
		}

  }]);



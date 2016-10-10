'use strict';

angular.module('myrejagtenApp')
	.controller('NavbarCtrl', function($rootScope, $scope, $location, Login) {

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Login.isLoggedIn;
		$scope.getCurrentUser = Login.currentUser;
		$scope.isAdmin = Login.isAdmin;
		$scope.user;

		$scope.logout = function() {
			Login.logout();
			$location.path('/login');
		};

		$scope.isActive = function(route) {
			return route === $location.path();
		};

		$scope.getCurrentUser(function(user) {
			$scope.user = user;
		});


	});

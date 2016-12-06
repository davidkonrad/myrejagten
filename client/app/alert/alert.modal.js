'use strict';

angular.module('myrejagtenApp')
  .factory('Alert', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null,
				modal = null,
				name = 'alertParams'

		return {

//************************************************			
			show: function($scope, title, message, okOnly, icon) {
				$scope[name] = {
					title: title,
					message: message,
					okOnly: okOnly,
					icon: 'fa-warning'
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/alert.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					//
				})

				$scope.alertModalClose = function(value) {
					delete $scope[name] 
					modal.hide()
		      deferred.resolve(value)
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 13) $scope.alertModalClose(true)
				})

	      return deferred.promise;
			},


//************************************************
			confirm: function($scope, question) {
				$scope[name] = {
					question: question
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/confirm.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.alertModalClose = function(value) {
					delete $scope[name] 
					modal.hide()
		      deferred.resolve(value)
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 13) $scope.alertModalClose(true)
				})

	      return deferred.promise;
			},


//************************************************
			sorry: function($scope, message) {
				$scope[name] = {
					message: message
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/sorry.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.alertModalClose = function(value) {
					delete $scope[name] 
					modal.hide()
		      deferred.resolve(value)
				}

	      return deferred.promise;
			},

//************************************************
			analyseMail: function($scope, email, mailBody) {
				$scope[name] = {
					email: email,
					mailBody: mailBody
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/analysemail.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					$('#textarea').focus();
				})

				$scope.alertModalClose = function(value) {
					if (value) value = $('#textarea').val();
					delete $scope[name];
					modal.hide()
		      deferred.resolve(value)
				}

	      return deferred.promise;
			}			

		}

	}]);



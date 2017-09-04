'use strict';

angular.module('myrejagtenApp')
  .factory('Alert', ['$modal', '$q', '$timeout', 'Upload', function($modal, $q, $timeout, Upload) {

		var deferred = null;
		var	modal = null;
		var name = 'alertParams';

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
			waitModal: undefined,
			waitShow: function($scope, title) {
				$scope[name] = {
					title: title
				}
				this.waitModal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/wait.modal.html',
					backdrop: 'static',
					show: true
				})
			},
			waitHide: function() {
				this.waitModal.hide();
				this.waitModal = undefined;
			},

//************************************************
			confirm: function($scope, question, message) {
				$scope[name] = {
					question: question,
					message: message
				}
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/alert/confirm.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.alertModalClose = function(value) {
					delete $scope[name];
					modal.hide();
		      deferred.resolve(value);
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
				});

				delete $scope.attachFile;
				$scope.registerFile = function(file, errFiles) {
					$scope.attachFile = file;
		    }

				modal.$promise.then(modal.show).then(function() {
					$('#textarea').focus();
				});

				//text much be larger than 50 chars
				$scope.checkBodyLength = function() {
					if (!$('#textarea').length) return; //modal closed
					return $('#textarea').val().length > 50;
				}

				$scope.alertModalClose = function(value) {
					if (value) {
						var options = {
							mailBody: $('#textarea').val()
						};
						var file = $scope.attachFile;
		        if (file) {
	            file.upload = Upload.upload({
								url: '/api/upload/cache', 
								data: {file: file}
	            }).then(function(response) {
								options.attach = response.data ? response.data : '';
					      deferred.resolve(options);
							})
		        } else {
				      deferred.resolve(options);
						}
						modal.hide();
					} else {
						delete $scope[name];
						modal.hide();
			      deferred.resolve(false)
					}
				}

	      return deferred.promise;
			}			

		}

	}]);



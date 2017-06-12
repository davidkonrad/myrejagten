'use strict';

angular.module('myrejagtenApp')
  .factory('UploadModal', ['$modal', '$compile', '$q', '$timeout', 'Upload', 'Eksperiment', 
		function($modal, $compile, $q, $timeout, Upload, Eksperiment) {

		var deferred = null,
				modal = null,
				name = 'uploadModal'

		return {

			image: function(scope, eksperiment_id, currentImage) {
				scope.currentImage = currentImage
				scope.uploadFile = function() {
					var file = scope.selectedFile
	        if (file) {
            file.upload = Upload.upload({
							url: '/api/upload/image', 
							data: {file: file}
            }).then(function(response) {
							var fileName = response.data ? response.data : '';
							Eksperiment.update({ id: eksperiment_id }, { upload_billede: fileName }).$promise.then(function(result)  {
								scope.modalClose(fileName)
							})
						})
	        }   
				}

				scope.registerFile = function(file, errFiles) {
        	scope.f = file;
					scope.errFile = errFiles && errFiles[0];
					scope.selectedFile = file

					$timeout(function() {
						$(window).trigger('resize')
						scope.$apply()
					})
		    }
 
				deferred = $q.defer()
				modal = $modal({
					scope: scope,
					templateUrl: 'app/upload/upload.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					delete scope.selectedFile
					$compile(angular.element('#modal-upload-image').contents())(scope)
					//
				})

				scope.modalClose = function(value) {
					modal.hide();
		      deferred.resolve(value);
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 13) scope.modalClose(true)
				})

	      return deferred.promise;
			}
		}

}]);



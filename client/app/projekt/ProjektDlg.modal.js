'use strict';

angular.module('myrejagtenApp')
  .factory('ProjektDlg', ['$modal', '$q',	function($modal, $q) {

		return {
			show: function($scope, projekt) {

				var deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/projekt/ProjektDlg.modal.html',
					backdrop: 'static',
					show: true
				});


	      return deferred.promise;
			}
			
		}

}]);



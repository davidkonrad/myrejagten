'use strict';

angular.module('myrejagtenApp')
  .factory('ResultatDlg', ['$modal', '$q', '$timeout', 'Resultat', 'Eksperiment',
	function($modal, $q, $timeout, Resultat, Eksperiment) {

		var deferred = null,
				modal = null;

		return {
			
			show: function(data, $scope) {

				var changed = false;

				$scope.resDlg = {
					empty: '…‽',
					data: data
				}

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/ResultatDlg/ResultatDlg.modal.html',
					backdrop: 'static',
					show: true
				})

				Eksperiment.query({ where: { eksperiment_id: data.eksperiment_id }} ).$promise.then(function(e) {
					$scope.resDlg.eksperiment = e[0]
				})

				function populateAllearter() {
					$('.aa-vid').each(function() {
						$(this).typeahead({
							displayText: function(item) {
								return item.Videnskabeligt_navn
							},
							afterSelect: function(item) {
							}, 
							items : 20,
							source: function(query, process) {
								var url='http://allearter-databasen.dk/api/?get=arter&query='+encodeURIComponent(query);
								return $.get(url, {}, function(data) {
									return process(data.allearter);
								})
							}
						})
					})
					$('.aa-dk').each(function() {
						$(this).typeahead({
							displayText: function(item) {
								return item.Dansk_navn
							},
							afterSelect: function(item) {
							}, 
							items : 20,
							source: function(query, process) {
								var url='http://allearter-databasen.dk/api/?get=arter&query='+encodeURIComponent(query);
								return $.get(url, {}, function(data) {
									return process(data.allearter);
								})
							}
						})
					})
				}
				
				function reload() {
					Resultat.query({ where: { data_id: data.data_id }} ).$promise.then(function(res) {
						$scope.resDlg.resultater = res
						$timeout(function() {
							populateAllearter()
						})
					})
				}
				reload()

				modal.$promise.then(modal.show).then(function() {
					$('#btn-create').on('click', function() {
						Resultat.save({ id: '' }, { data_id: $scope.resDlg.data.data_id }).$promise.then(function() {
							changed = true;
							reload()
						})
					})
				})

				$scope.modalClose = function() {
					modal.hide()
		      deferred.resolve(changed)
				}

				$scope.resDlg.deleteResultat = function(resultat_id) {
					Resultat.delete({ id: resultat_id }).$promise.then(function() {
						reload()
					})
				}

				$scope.resDlg.saveResultat = function(resultat) {
					Resultat.update({ resultat_id: resultat.resultat_id }, resultat).$promise.then(function() {
						resultat.edited = undefined
					})
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 27) $scope.modalClose()
				})

	      return deferred.promise;
			}
		}

	}]);



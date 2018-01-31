'use strict';

angular.module('myrejagtenApp')
  .factory('ResultatDlg', ['$modal', '$q', '$http', '$timeout', 'Resultat', 'Eksperiment', 'Data', 'Utils', 'Alert', 'MysqlUser', 'Analyse_mail', 
	function($modal, $q, $http, $timeout, Resultat, Eksperiment, Data, Utils, Alert, MysqlUser, Analyse_mail) {

		var lookup = [];
		var lookup_dk = [];
		$.getJSON('assets/formicidae.json', function(json) {
			lookup = json;
			lookup_dk = json.filter(function(taxon) {
				if (taxon.Dansk_navn != '') return taxon
			});
			function exists(n) {
				for (var i=0, l=json.length; i<l; i++) {
					if (json[i].videnskabeligt_navn == n) return true
				}
				return false
			}
			Resultat.getTaxonNames().$promise.then(function(r) {
				r.forEach(function(n) {
					if (!exists(n.navn_videnskabeligt)) lookup.push({
						Videnskabeligt_navn : n.navn_videnskabeligt,
						Dansk_navn: n.navn_dk ? n.navn_dk : '' //convert null to ""
					})
				})
			})	
		})

		return {
			
			show: function(data, $scope) {
				var deferred = null;
				var	modal = null;
				var changed = false;

				$scope.resDlg = {
					empty: ' ― ',
					data: data
				}

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/ResultatDlg/ResultatDlg.modal.html',
					backdrop: 'static',
					show: true
				});

				Eksperiment.query({ where: { eksperiment_id: data.eksperiment_id }} ).$promise.then(function(e) {
					$scope.resDlg.eksperiment = e[0];
				});

				function getAnalyseMails() {
					Analyse_mail.query({ where: { eksperiment_id: data.eksperiment_id }} ).$promise.then(function(m) {
						$scope.analyseMails = m;
					})
				}
				getAnalyseMails();

				function updateResultat(resultat_id, prop, value) {
					for (var i=0, l=$scope.resDlg.resultater.length; i<l; i++) {
						if ($scope.resDlg.resultater[i].resultat_id == resultat_id) {
							$scope.resDlg.resultater[i][prop] = value;
							$scope.$apply();
							return;
						}
					}
				}

				function populateAllearter() {
					$('.aa-vid').each(function() {
						$(this).typeahead({
							displayText: function(item) {
								return item.Videnskabeligt_navn
							},
							showHintOnFocus: true,
							afterSelect: function(item) {
								var id = this.$element.attr('resultat_id');
								updateResultat(id, 'navn_dk', item.Dansk_navn);
								var specie = item.Videnskabeligt_navn.split(' ');
								updateResultat(id, 'genus', specie[0]);
								updateResultat(id, 'specie', specie[1] ? specie[1] : '' );
							}, 
							autoSelect: false,
							items : 20,
							source: lookup
						})
					})
					$('.aa-dk').each(function() {
						$(this).typeahead({
							displayText: function(item) {
								return item.Dansk_navn
							},
							afterSelect: function(item) {
								var id = this.$element.attr('resultat_id');
								updateResultat(id, 'navn_videnskabeligt', item.Videnskabeligt_navn);
								var specie = item.Videnskabeligt_navn.split(' ');
								updateResultat(id, 'genus', specie[0]);
								updateResultat(id, 'specie', specie[1] ? specie[1] : '' );
							}, 
							autoSelect: false,
							showHintOnFocus: true,
							items : 20,
							source: lookup_dk
						})
					})
				}
				
				function reload(resultat_id) {
					Resultat.query({ where: { data_id: data.data_id }} ).$promise.then(function(res) {
						$scope.resDlg.resultater = res
						$timeout(function() {
							$scope.$apply();
							populateAllearter();
							if (resultat_id) {
								angular.element('#antal'+resultat_id).focus().click();
							}
						})
					})
				}
				reload()

				modal.$promise.then(modal.show).then(function() {
					$('#btn-create').on('click', function() {
						Resultat.save({ id: '' }, { data_id: $scope.resDlg.data.data_id }).$promise.then(function(r) {
							changed = true;
							reload(r.resultat_id);
						});
					})
				});

				$scope.$on("modal.hide",function() {
		      deferred.resolve(changed);
				});

				$scope.resDlg.deleteResultat = function(resultat_id) {
					Alert.confirm($scope, 'Slet analyseresultat?').then(function(answer) {
						if (answer) Resultat.delete({ id: resultat_id }).$promise.then(function() {
							reload()
						})
					})
				}

				$scope.resDlg.saveResultat = function(resultat) {
					Resultat.update({ resultat_id: resultat.resultat_id }, resultat).$promise.then(function() {
						resultat.edited = undefined
					})
				}

				$scope.resDlg.sendMail = function(user_id, eksperiment_id, myrejagt_id) {
					var deferred = $q.defer();
					var mailBody = '' 
						+ 'Kære myrejæger, ' +"\n\n"
						+ 'Tusind tak for din deltagelse! ' +"\n\n"
						+ 'Naturhistorisk Museum har nu analyseret dine fund fra eksperiment '+ myrejagt_id +'. '
						+ 'Under eksperimentet fandt du: ' +"\n\n"
						+ '';

					var mailFooter = '' +"\n\n" 
						+ 'Vi håber din deltagelse har været sjov og lærerig. Husk at du kan deltage så mange gange du vil, og at forskerne ikke kan gennemføre deres studier uden din hjælp! Skulle du have yderligere spørgsmål er du velkommen til at kontakte myrejagten på myrejagten@snm.ku.dk. ' +"\n\n"
						+ 'Med venlig hilsen,' + "\n\n"
						+ 'Myrejagtens forskerteam';

					MysqlUser.query({ where : { user_id : user_id }}).$promise.then(function(user) {
						
						Data.query({ where : { eksperiment_id: eksperiment_id }}).$promise.then(function(datas) {

							function getMadding(data_id) {
								for (var di=0, dl=datas.length; di<dl; di++) {								
									if (datas[di].data_id == data_id) return datas[di].madding
								}
								return '??'
							}

							var result = [];
							var processed = false;
						
							for (var di=0, dl=datas.length; di<dl; di++) {
								Resultat.query({ where: { data_id: datas[di].data_id }} ).$promise.then(function(res) {
									var text = '';
									for (var i=0, l=res.length; i<l; i++) {
										if (!result[res[i].data_id]) {
											result[res[i].data_id] = [];
										}
										result[res[i].data_id].push(res[i]);
									}
								})
							}

							$timeout(function() {
								for (var i in result) {
									var text = getMadding(i) +"\n";
									var r = result[i];
									for (var ri=0, rl=r.length; ri<rl; ri++) {
										text += r[ri].antal +"\t";
										text += r[ri].navn_videnskabeligt +"\t\t";
										text += r[ri].navn_dk +"\t\t";
										text += r[ri].kommentar +"\n"
									}
									mailBody += text.replace(/null/g, '') +"\n"
								}	
								$timeout(function() {
									deferred.resolve();
								})
							}, 500)
						})

						deferred.promise.then(function() {
							Alert.analyseMail($scope, user[0].email, mailBody + mailFooter).then(function(options) {
								if (options) {		
									Alert.waitShow($scope, 'Sender email ...');
									options.email = user[0].email;
									options.subject = 'Analyse fra myrejagten';
									$http.post('api/email/raw/', options).then(function(response) {
										if (response.data.ok) {
											changed = true;
											var obj = {
												email: options.email,
												mail_body: options.mailBody,
												eksperiment_id: $scope.resDlg.eksperiment.eksperiment_id,
												myrejagt_id: $scope.resDlg.eksperiment.myrejagt_id,
												attachments: options.attach ? options.attach.originalFileName : ''
											};
											Analyse_mail.save( { analyse_mail_id: '' }, obj).$promise.then(function() {
												//update the list of sent mails
												getAnalyseMails();
												Alert.waitHide();
											});

											//remove cached file(s)
											if (options.attach) {
												options.attach.forEach(function(f) {
													$http.get('/api/upload/removeCache/'+encodeURIComponent(f.cachedFileName)).then(function(res) {
														//console.log('cached file '+options.attach.cachedFileName+' deleted');
													})
												})
											}
										} else {
											console.log('email fejl: ', response.data.error);
											Alert.waitHide();
										}
									});
								}
							});
						});
					});
				}

				$scope.updateProeveModtaget = function() {
					if (!$scope.resDlg.globalDate) {
						Data.update({ id: data.data_id }, { proeve_modtaget: data.proeve_modtaget }).$promise.then(function() {
							changed = true;
						})
					} else {
						//update all data on eksperiment_id
						Data.query({ where : { eksperiment_id: $scope.resDlg.eksperiment.eksperiment_id }}).$promise.then(function(datas) {
							datas.forEach(function(d) {
								Data.update({ id: d.data_id }, { proeve_modtaget: data.proeve_modtaget }).$promise.then(function() {
								})
							})
						})
						changed = true;
					}
				}

				$scope.updateProeveModtagetIrrelevant = function() {
					if (!$scope.resDlg.globalDate) {
						Data.update({ id: data.data_id }, { proeve_modtaget: '1900-01-01' }).$promise.then(function(r) {
							changed = true;
						})
					} else {
						Data.query({ where : { eksperiment_id: $scope.resDlg.eksperiment.eksperiment_id }}).$promise.then(function(datas) {
							datas.forEach(function(d) {
								Data.update({ id: d.data_id }, { proeve_modtaget: '1900-01-01' }).$promise.then(function(r) {
								})
							})
						})
						changed = true;
					}
				}

				$scope.updateProeveAnalyseret = function() {
					Data.update({ id: data.data_id }, { proeve_analyseret: data.proeve_analyseret }).$promise.then(function() {
						changed = true;
					})
				}
				
				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 27) $scope.modalClose(true)
				})

	      return deferred.promise;
			}
		}

	}]);



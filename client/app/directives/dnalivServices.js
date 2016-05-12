'use strict';

angular.module('myrejagtenApp')
  .factory('Utils', function() {
		return {

			getObj: function($resource, prefix) {
				var exclude = ['$promise','$resolved','toJSON','$get','$save','$query','$remove','$delete','$update'],
						prop, p = {};
				for (prop in $resource) {
					if (prefix) {
						if (~prop.indexOf(prefix)) p[prop] = $resource[prop]
					} else {
						if (!~exclude.indexOf(prop)) p[prop] = $resource[prop]
					}
				}
				return p;
			},

			mergeObj: function(toObject, srcObject, overwrite) {
				srcObject = this.getObj(srcObject)
				for (var p in srcObject) {
					toObject[p] = srcObject[p]
				}
			},

			fixDate : function(date) {
				var d = new Date(date);
				if (!isNaN(d.getTime())) {
					return ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + d.getFullYear();
				} else {
					return '' //'?'
				}
			},

			formIsEdited : function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i=0, inputs = form.querySelectorAll('input');
					for (i; i<inputs.length; i++) {
						if (angular.element(inputs[i]).hasClass('ng-dirty')) return true
					}
				}
				return false
			},

			formReset: function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i=0, inputs = form.querySelectorAll('input');
					for (i; i<inputs.length; i++) {
						angular.element(inputs[i]).removeClass('ng-dirty')
					}
				}
			},

			dataTables_daDk: {
		    "sEmptyTable":     "Ingen tilgængelige data (prøv en anden søgning)",
		    "sInfo":           "Viser _START_ til _END_ af _TOTAL_ rækker",
		    "sInfoEmpty":      "Viser 0 til 0 af 0 rækker",
  		  "sInfoFiltered":   "(filtreret ud af _MAX_ rækker ialt)",
  		  "sInfoPostFix":    "",
  		  "sInfoThousands":  ",",
		    "sLengthMenu":     "Vis _MENU_ rækker",
		    "sLoadingRecords": "Henter data...",
		    "sProcessing":     "Processing...",
		    "sSearch":         "Filter:",
		    "sZeroRecords":    "Ingen rækker matchede filter",
		    "oPaginate": {
	        "sFirst":    "Første",
	        "sLast":     "Sidste",
	        "sNext":     "Næste",
	        "sPrevious": "Forrige"
		    },
		    "oAria": {
	        "sSortAscending":  ": activate to sort column ascending",
	        "sSortDescending": ": activate to sort column descending"
		    }
			},

			dtNormalizeButtons: function() {
				$('.dt-button').each(function(btn) {
					$(this).removeClass('dt-button').removeClass('buttons-collection').removeClass('buttons-colvis') 
				})
			},

			dtPerformSearch: function(term) {
				var input = document.querySelector('.dataTables_filter input')
				input.value = term
				$(input).trigger('keyup')
			},

			//status options map
			statusOptions: [
				{ "value": -1, "text": "Aflyst", "class": "btn-danger" }, 
				{ "value": 0, "text": "Ikke bekræftet", "class": "btn-inverse" }, 
				{ "value": 1, "text": "Bekræftet", "class": "btn-success" }
			],

			//administrative enheder
			aeNoWater : ['spredtBebyggelse', 'bydel', 'by', 'gård', 'sten', 'bro', 'hus', 'kløft', 'andenBygning', 'dal', 
										'museumSamling', 'agerMark', 'eng', 'hede', 'gravhøj', 'højdedrag', 'bakke', 'campingsplads', 'slugt',
										'kirkeProtestantisk', 'hal', 'skovPlantage', 'stadion', 'vejrmølle', 'udsigtstårn', 'golfbane', 
										'folkeskole', 'folkehøjskole', 'turistbureau', 'vejbro', 'mindesten', 'langdysse', 'specialskole',
										'voldVoldsted', 'privatskoleFriskole', 'kommunekontor', 'dyrepark', 'grænsestenGrænsepæl', 'hotel',
										'andenSeværdighed', 'udsigtspunkt', 'tog', 'boplads', 'øgruppe', 'fagskole', 'fyrtårn', 'blomsterpark',
										'universitet', 'professionshøjskole', 'kursuscenter', 'uddannelsescenter', 'zoologiskHave',
										'kirkeAndenKristen', 'herregård', 'storby', 'kolonihave', 'land', 'gravsted', 'kraftvarmeværk', 
										'undersøiskGrund', 'odde', 'klint', 'halvø', 'rådhus', 'skydebane', 'flyveplads', 'parkAnlæg', 'ø',
										'sommerhusområde', 'goKartbane', 'dysse', 'løb', 'ruin', 'reservat', 'mindreLufthavn', 'pynt', 'hage',
										'gymnasium', 'industriområde', 'feriecenter', 'efterskoleUngdomsskole', 'kristen', 'rastepladsMedService',
										'klippeIOverfladen', 'rastepladsUdenService', 'sommerhusområdedel', 'røse', 'køretekniskAnlæg', 
										'runddysse', 'landingsplads', 'fængsel', 'bilfærge', 'næs', 'højBanke', 'jættestue', 'vandrerhjem',
										'sandKlit', 'vandkraftværk', 'hule', 'trafikhavn', 'vindmøllepark', 'fæstningsanlæg', 'motorbane',
										'strand', 'vej', 'hospital', 'båke', 'skanse', 'runesten', 'vikingeborg', 'slot', 'historiskMindeHistoriskAnlæg',
										'veteranjernbane', 'cykelbane', 'terminal', 'bredning', 'motorvejskryds', 'skær', 'skibssætning', 
										'skræntNaturlig', 'motocrossbane', 'forlystelsespark', 'marsk', 'personfærge', 'svæveflyveplads',
										'hundevæddeløbsbane', 'varde', 'primærRingvej', 'sekundærRingvej', 'restriktionsareal', 'landsdel',
										'overskylledeSten', 'vejkryds', 'lavning', 'arboret', 'løvtræ', 'bautasten', 'bautasten', 
										'sti', 'plads', 'heliport', 'hestevæddeløbsbane', 'ledLåge', 'ås', 'observatorium', 'fiskerihavn',
										'sejlløb', 'nor', 'tomt'
									],
			aeWaterTypes: ['sø', 'vandløb', 'vandloeb', 'soe', 'å', 'kilde', 'hav', 'fjord', 'bæk', 'mose', 'sump', 'moseSump',
											//doubtful matches
											'bugt', 'strandpost', 'lystbådehavn', 'sund', 'vandmølle', 'tørtVedLavvande', 'botaniskHave'
											],
			aePass: "&login=davidkonrad&password=nhmdzm",

			//kommentar_type hardcoded
			KOMMENTAR_TYPE : {
				BOOKING: 1,
				KLASSE: 2,
				PROEVE: 3,
				RESULTAT: 4,
				LOKALITET: 5
			}
	
		}
	});


	/**
	defaults for jQuery dataTables
	 **/	
	$.extend( true, $.fn.dataTable.defaults, {
	  "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Alle"] ]
	});


angular.module('myrejagtenApp').
	directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.]/g, '');

            if (digits.split('.').length > 2) {
              digits = digits.substring(0, digits.length - 1);
            }

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
 });

'use strict';

angular.module('myrejagtenApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
	'mgcrea.ngStrap', 
	'cfp.hotkeys',
	'LocalStorageModule',
	'angular-inview',
	'leaflet-directive',
	'datatables',
	'datatables.buttons',
	'datatables.bootstrap',
	'frapontillo.bootstrap-switch'
])
  .config(["$routeProvider", "$locationProvider", "$httpProvider", function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }])

  .factory('authInterceptor', ["$rootScope", "$q", "$cookieStore", "$location", function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .run(["$rootScope", "$location", "Auth", function ($rootScope, $location, Auth) {
	 
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
				/*
				var publicLocation = next.$$route.templateUrl || next.$$route.loadedTemplateUrl;
				if (typeof publicLocation == 'string') {
					publicLocation = ['main.html','login.html'].indexOf(publicLocation.split('/').splice(-1,1)[0])>0
				} else {
					publicLocation = false
				}
        if (!publicLocation && !loggedIn) {
          $location.path('/'); //redirect to frontpage
        }
				*/

        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }

      });
    });
  }]);
  
  

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('LoginCtrl', ["$scope", "Auth", "$location", "$window", "$cookieStore", function ($scope, Auth, $location, $window, $cookieStore) {
    $scope.user = {};
    $scope.errors = {};

	var rememberMe = $cookieStore.get('rememberMe');
	if (rememberMe) {
		$scope.user.email = rememberMe.m;
		$scope.user.password = rememberMe.p;
		$scope.user.rememberMe = true;
	}
	
    $scope.login = function(form) {

		if ($scope.user.rememberMe) {
			$cookieStore.put('rememberMe', { 'm' : $scope.user.email, 'p' : $scope.user.password} );
		} else {
			$cookieStore.remove('rememberMe');
		}

      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('SettingsCtrl', ["$scope", "User", "Auth", function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('SignupCtrl', ["$scope", "Auth", "$location", "$window", function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('AdminCtrl', ['$scope', '$http', function ($scope, $http) {


}]);


'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .factory('Alert', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null,
				modal = null,
				name = 'alertParams'

		return {
			
			show: function($scope, title, message) {
				$scope[name] = {
					title: title,
					message: message
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

	      return deferred.promise;
			}
		}

	}]);



'use strict';

angular.module('myrejagtenApp')
  .controller('BrugerkontoCtrl', ['$scope', '$compile', '$timeout', '$modal', 'ForsoegModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, ForsoegModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	$scope.createForsoeg = function() {
		ForsoegModal.new($scope).then(function(created) {		
			alert(created)
		})
	}
	

  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/brugerkonto', {
        templateUrl: 'app/brugerkonto/brugerkonto.html',
        controller: 'BrugerkontoCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('CreateUserCtrl', ['$scope', '$compile', '$timeout', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	 function($scope, $compile, $timeout, $modal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {


  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/opret-bruger', {
        templateUrl: 'app/createuser/createuser.html',
        controller: 'CreateUserCtrl'
      });
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name dnaApp.directive:allearterTypeahead
 * @description
 * # allearterTypeahead
 */
angular.module('myrejagtenApp')
  .directive('allearterTypeahead', ["$parse", function ($parse) {
    return {
      restrict: 'A',
			scope : {
				taxon : '=atTaxon'
			},
			link: function postLink(scope, element, attrs) {
				var dansk = attrs.allearterTypeahead == 'dk';
				$(element).typeahead({
					displayText: function(item) {
						return dansk ? item.Dansk_navn : item.Videnskabeligt_navn;
					},
					afterSelect: function(item) {
						scope.taxon.Videnskabeligt_navn = item.Videnskabeligt_navn;
						scope.taxon.Dansk_navn = item.Dansk_navn;
						scope.$apply()
					}, 
					items : 20,
					source: function(query, process) {
						var url='http://allearter-databasen.dk/api/?get=arter&query='+query;
						return $.get(url, {}, function(data) {
							return process(data.allearter);
						})
					}
				})
			}
		}
}])

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

'use strict';

/**
	http://spatialreference.org/ref/epsg/etrs89-utm-zone-32n/
	
**/

angular.module('myrejagtenApp')
  .factory('Geo', function() {
		return {

	    /* Ellipsoid model constants (actual values here are for WGS84) */
	    sm_a: 6378137.0,
	    sm_b: 6356752.314,
	    sm_EccSquared: 6.69437999013e-03,
			UTMScaleFactor: 0.9996,

	    /*
  	  * degToRad
  	  *
  	  * Converts degrees to radians.
  	  *
  	  */
  	  degToRad: function(deg) {
				return (deg / 180.0 * Math.PI)
			},

	    /*
	    * RadToDeg
	    *
	    * Converts radians to degrees.
	    *
	    */
	    radToDeg: function(rad) {
				return (rad / Math.PI * 180.0)
			},

	    /*
    	* ArcLengthOfMeridian
	    *
  	  * Computes the ellipsoidal distance from the equator to a point at a
  	  * given latitude.
  	  *
  	  * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
  	  * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
  	  *
  	  * Inputs:
  	  *     phi - Latitude of the point, in radians.
  	  *
  	  * Globals:
  	  *     sm_a - Ellipsoid model major axis.
  	  *     sm_b - Ellipsoid model minor axis.
  	  *
  	  * Returns:
  	  *     The ellipsoidal distance of the point from the equator, in meters.
  	  *
  	  */
			arcLengthOfMeridian: function(phi) {
        var alpha, beta, gamma, delta, epsilon, n;
        var result;

        /* Precalculate n */
        n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);

        /* Precalculate alpha */
        alpha = ((this.sm_a + this.sm_b) / 2.0)
           * (1.0 + (Math.pow (n, 2.0) / 4.0) + (Math.pow (n, 4.0) / 64.0));

        /* Precalculate beta */
        beta = (-3.0 * n / 2.0) + (9.0 * Math.pow (n, 3.0) / 16.0)
           + (-3.0 * Math.pow (n, 5.0) / 32.0);

        /* Precalculate gamma */
        gamma = (15.0 * Math.pow (n, 2.0) / 16.0)
            + (-15.0 * Math.pow (n, 4.0) / 32.0);
    
        /* Precalculate delta */
        delta = (-35.0 * Math.pow (n, 3.0) / 48.0)
            + (105.0 * Math.pow (n, 5.0) / 256.0);
    
        /* Precalculate epsilon */
        epsilon = (315.0 * Math.pow (n, 4.0) / 512.0);
    
		    /* Now calculate the sum of the series and return */
		    result = alpha * (phi + (beta * Math.sin (2.0 * phi))  + (gamma * Math.sin (4.0 * phi))
		            + (delta * Math.sin (6.0 * phi))
		            + (epsilon * Math.sin (8.0 * phi)));

		    return result;
	    },

	    /*
	    * UTMCentralMeridian
	    *
	    * Determines the central meridian for the given UTM zone.
	    *
	    * Inputs:
	    *     zone - An integer value designating the UTM zone, range [1,60].
	    *
	    * Returns:
	    *   The central meridian for the given UTM zone, in radians, or zero
	    *   if the UTM zone parameter is outside the range [1,60].
	    *   Range of the central meridian is the radian equivalent of [-177,+177].
	    *
	    */
    	UTMCentralMeridian: function(zone) {
				var cmeridian;
        cmeridian = this.degToRad (-183.0 + (zone * 6.0));
        return cmeridian;
			},

	    /*
	    * footpointLatitude
	    *
	    * Computes the footpoint latitude for use in converting transverse
	    * Mercator coordinates to ellipsoidal coordinates.
	    *
	    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
	    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
	    *
	    * Inputs:
	    *   y - The UTM northing coordinate, in meters.
	    *
	    * Returns:
	    *   The footpoint latitude, in radians.
	    *
	    */
	    footpointLatitude: function(y) {
        var y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
        var result;
        
        /* Precalculate n (Eq. 10.18) */
        n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);
        	
        /* Precalculate alpha_ (Eq. 10.22) */
        /* (Same as alpha in Eq. 10.17) */
        alpha_ = ((this.sm_a + this.sm_b) / 2.0)
            * (1 + (Math.pow (n, 2.0) / 4) + (Math.pow (n, 4.0) / 64));
        
        /* Precalculate y_ (Eq. 10.23) */
        y_ = y / alpha_;
        
        /* Precalculate beta_ (Eq. 10.22) */
        beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow (n, 3.0) / 32.0)
            + (269.0 * Math.pow (n, 5.0) / 512.0);
        
        /* Precalculate gamma_ (Eq. 10.22) */
        gamma_ = (21.0 * Math.pow (n, 2.0) / 16.0)
            + (-55.0 * Math.pow (n, 4.0) / 32.0);
        	
        /* Precalculate delta_ (Eq. 10.22) */
        delta_ = (151.0 * Math.pow (n, 3.0) / 96.0)
            + (-417.0 * Math.pow (n, 5.0) / 128.0);
        	
        /* Precalculate epsilon_ (Eq. 10.22) */
        epsilon_ = (1097.0 * Math.pow (n, 4.0) / 512.0);
        	
        /* Now calculate the sum of the series (Eq. 10.21) */
        result = y_ + (beta_ * Math.sin (2.0 * y_))
            + (gamma_ * Math.sin (4.0 * y_))
            + (delta_ * Math.sin (6.0 * y_))
            + (epsilon_ * Math.sin (8.0 * y_));
        
        return result;
	    },

	    /*
	    * mapLatLngToXY
	    *
	    * Converts a latitude/longitude pair to x and y coordinates in the
	    * Transverse Mercator projection.  Note that Transverse Mercator is not
	    * the same as UTM; a scale factor is required to convert between them.
	    *
	    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
	    * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
	    *
	    * Inputs:
	    *    phi - Latitude of the point, in radians.
	    *    lambda - Longitude of the point, in radians.
	    *    lambda0 - Longitude of the central meridian to be used, in radians.
	    *
	    * Outputs:
	    *    xy - A 2-element array containing the x and y coordinates
	    *         of the computed point.
	    *
	    * Returns:
	    *    The function does not return a value.
	    *
	    */
	    mapLatLngToXY: function(phi, lambda, lambda0, xy) {
        var N, nu2, ep2, t, t2, l;
        var l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
        var tmp;

        /* Precalculate ep2 */
        ep2 = (Math.pow (this.sm_a, 2.0) - Math.pow (this.sm_b, 2.0)) / Math.pow (this.sm_b, 2.0);
    
        /* Precalculate nu2 */
        nu2 = ep2 * Math.pow (Math.cos (phi), 2.0);
    
        /* Precalculate N */
        N = Math.pow (this.sm_a, 2.0) / (this.sm_b * Math.sqrt (1 + nu2));
    
        /* Precalculate t */
        t = Math.tan (phi);
        t2 = t * t;
        tmp = (t2 * t2 * t2) - Math.pow (t, 6.0);

        /* Precalculate l */
        l = lambda - lambda0;
    
        /* Precalculate coefficients for l**n in the equations below
           so a normal human being can read the expressions for easting
           and northing
           -- l**1 and l**2 have coefficients of 1.0 */
        l3coef = 1.0 - t2 + nu2;
    
        l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);
    
        l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2
            - 58.0 * t2 * nu2;
    
        l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2
            - 330.0 * t2 * nu2;
    
        l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);
    
        l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);
    
        /* Calculate easting (x) */
        xy[0] = N * Math.cos (phi) * l
            + (N / 6.0 * Math.pow (Math.cos (phi), 3.0) * l3coef * Math.pow (l, 3.0))
            + (N / 120.0 * Math.pow (Math.cos (phi), 5.0) * l5coef * Math.pow (l, 5.0))
            + (N / 5040.0 * Math.pow (Math.cos (phi), 7.0) * l7coef * Math.pow (l, 7.0));
    
        /* Calculate northing (y) */
        xy[1] = ArcLengthOfMeridian (phi)
            + (t / 2.0 * N * Math.pow (Math.cos (phi), 2.0) * Math.pow (l, 2.0))
            + (t / 24.0 * N * Math.pow (Math.cos (phi), 4.0) * l4coef * Math.pow (l, 4.0))
            + (t / 720.0 * N * Math.pow (Math.cos (phi), 6.0) * l6coef * Math.pow (l, 6.0))
            + (t / 40320.0 * N * Math.pow (Math.cos (phi), 8.0) * l8coef * Math.pow (l, 8.0));
    
        return;
	    },
    
	    /*
	    * MapXYToLatLon
	    *
	    * Converts x and y coordinates in the Transverse Mercator projection to
	    * a latitude/longitude pair.  Note that Transverse Mercator is not
	    * the same as UTM; a scale factor is required to convert between them.
	    *
	    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
	    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
	    *
	    * Inputs:
	    *   x - The easting of the point, in meters.
	    *   y - The northing of the point, in meters.
	    *   lambda0 - Longitude of the central meridian to be used, in radians.
	    *
	    * Outputs:
	    *   philambda - A 2-element containing the latitude and longitude
	    *               in radians.
	    *
	    * Returns:
	    *   The function does not return a value.
	    *
	    * Remarks:
	    *   The local variables Nf, nuf2, tf, and tf2 serve the same purpose as
	    *   N, nu2, t, and t2 in MapLatLonToXY, but they are computed with respect
	    *   to the footpoint latitude phif.
	    *
	    *   x1frac, x2frac, x2poly, x3poly, etc. are to enhance readability and
	    *   to optimize computations.
	    *
	    */
	    mapXYToLatLng: function(x, y, lambda0, philambda) {
        var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
        var x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
        var x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;
    	
        /* Get the value of phif, the footpoint latitude. */
        phif = this.footpointLatitude (y);
        	
        /* Precalculate ep2 */
        ep2 = (Math.pow (this.sm_a, 2.0) - Math.pow (this.sm_b, 2.0))
              / Math.pow (this.sm_b, 2.0);
        	
        /* Precalculate cos (phif) */
        cf = Math.cos (phif);
        	
        /* Precalculate nuf2 */
        nuf2 = ep2 * Math.pow (cf, 2.0);
        	
        /* Precalculate Nf and initialize Nfpow */
        Nf = Math.pow (this.sm_a, 2.0) / (this.sm_b * Math.sqrt (1 + nuf2));
        Nfpow = Nf;
        	
        /* Precalculate tf */
        tf = Math.tan (phif);
        tf2 = tf * tf;
        tf4 = tf2 * tf2;
        
        /* Precalculate fractional coefficients for x**n in the equations
           below to simplify the expressions for latitude and longitude. */
        x1frac = 1.0 / (Nfpow * cf);
        
        Nfpow *= Nf;   /* now equals Nf**2) */
        x2frac = tf / (2.0 * Nfpow);
        
        Nfpow *= Nf;   /* now equals Nf**3) */
        x3frac = 1.0 / (6.0 * Nfpow * cf);
        
        Nfpow *= Nf;   /* now equals Nf**4) */
        x4frac = tf / (24.0 * Nfpow);
        
        Nfpow *= Nf;   /* now equals Nf**5) */
        x5frac = 1.0 / (120.0 * Nfpow * cf);
        
        Nfpow *= Nf;   /* now equals Nf**6) */
        x6frac = tf / (720.0 * Nfpow);
        
        Nfpow *= Nf;   /* now equals Nf**7) */
        x7frac = 1.0 / (5040.0 * Nfpow * cf);
        
        Nfpow *= Nf;   /* now equals Nf**8) */
        x8frac = tf / (40320.0 * Nfpow);
        
        /* Precalculate polynomial coefficients for x**n.
           -- x**1 does not have a polynomial coefficient. */
        x2poly = -1.0 - nuf2;
        
        x3poly = -1.0 - 2 * tf2 - nuf2;
        
        x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2
        	- 3.0 * (nuf2 *nuf2) - 9.0 * tf2 * (nuf2 * nuf2);
        
        x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;
        
        x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2
        	+ 162.0 * tf2 * nuf2;
        
        x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);
        
        x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);
        	
        /* Calculate latitude */
        philambda[0] = phif + x2frac * x2poly * (x * x)
        	+ x4frac * x4poly * Math.pow (x, 4.0)
        	+ x6frac * x6poly * Math.pow (x, 6.0)
        	+ x8frac * x8poly * Math.pow (x, 8.0);
        	
        /* Calculate longitude */
        philambda[1] = lambda0 + x1frac * x
        	+ x3frac * x3poly * Math.pow (x, 3.0)
        	+ x5frac * x5poly * Math.pow (x, 5.0)
        	+ x7frac * x7poly * Math.pow (x, 7.0);
        	
        return;
	    },

	    /*
	    * LatLngToUTMXY
	    *
	    * Converts a latitude/longitude pair to x and y coordinates in the
	    * Universal Transverse Mercator projection.
	    *
	    * Inputs:
	    *   lat - Latitude of the point, in radians.
	    *   lon - Longitude of the point, in radians.
	    *   zone - UTM zone to be used for calculating values for x and y.
	    *          If zone is less than 1 or greater than 60, the routine
	    *          will determine the appropriate zone from the value of lon.
	    *
	    * Outputs:
	    *   xy - A 2-element array where the UTM x and y values will be stored.
	    *
	    * Returns:
	    *   The UTM zone used for calculating the values of x and y.
	    *
	    */
	    latLngToUTMXY: function(lat, lng, zone, xy) {
        this.mapLatLngToXY(lat, lng, this.UTMCentralMeridian(zone), xy);

        /* Adjust easting and northing for UTM system. */
        xy[0] = xy[0] * this.UTMScaleFactor + 500000.0;
        xy[1] = xy[1] * this.UTMScaleFactor;
        if (xy[1] < 0.0)
            xy[1] = xy[1] + 10000000.0;

        return zone;
	    },
    
	    /*
	    * UTMXYToLatLon
	    *
	    * Converts x and y coordinates in the Universal Transverse Mercator
	    * projection to a latitude/longitude pair.
	    *
	    * Inputs:
	    *	x - The easting of the point, in meters.
	    *	y - The northing of the point, in meters.
	    *	zone - The UTM zone in which the point lies.
	    *	southhemi - True if the point is in the southern hemisphere;
	    *               false otherwise.
	    *
	    * Outputs:
	    *	latlon - A 2-element array containing the latitude and
	    *            longitude of the point, in radians.
	    *
	    * Returns:
	    *	The function does not return a value.
	    *
	    */
	    UTMXYToLatLng: function(x, y, zone, southhemi, latLng) {
        var cmeridian;
        	
        x -= 500000.0;
        x /= this.UTMScaleFactor;
        	
        /* If in southern hemisphere, adjust y accordingly. */
        if (southhemi)
        y -= 10000000.0;
        		
        y /= this.UTMScaleFactor;
        
        cmeridian = this.UTMCentralMeridian(zone);
        this.mapXYToLatLng(x, y, cmeridian, latLng);
        	
        return;
	    },
    
	    /*
	    * btnToUTM_OnClick
	    *
	    * Called when the btnToUTM button is clicked.
	    *
	    */
	    btnToUTM_OnClick: function() {
        var xy = new Array(2);
        
        if (isNaN (parseFloat (document.frmConverter.txtLongitude.value))) {
            alert ("Please enter a valid longitude in the lon field.");
            return false;
        }

        lon = parseFloat (document.frmConverter.txtLongitude.value);

        if ((lon < -180.0) || (180.0 <= lon)) {
            alert ("The longitude you entered is out of range.  " +
                   "Please enter a number in the range [-180, 180).");
            return false;
        }

        if (isNaN (parseFloat (document.frmConverter.txtLatitude.value))) {
            alert ("Please enter a valid latitude in the lat field.");
            return false;
        }

        lat = parseFloat (document.frmConverter.txtLatitude.value);

        if ((lat < -90.0) || (90.0 < lat)) {
            alert ("The latitude you entered is out of range.  " +
                   "Please enter a number in the range [-90, 90].");
            return false;
        }

        // Compute the UTM zone.
        zone = Math.floor ((lon + 180.0) / 6) + 1;

        zone = LatLonToUTMXY (this.degToRad(lat), this.degToRad(lon), zone, xy);

        /* Set the output controls.  */
        document.frmConverter.txtX.value = xy[0];
        document.frmConverter.txtY.value = xy[1];
        document.frmConverter.txtZone.value = zone;
        if (lat < 0)
            // Set the S button.
            document.frmConverter.rbtnHemisphere[1].checked = true;
        else
            // Set the N button.
            document.frmConverter.rbtnHemisphere[0].checked = true;
        

        return true;
	    },	

	    /*
	    * EPSG25832_to_WGS84
	    *
	    * 
	    *
	    */
	    EPSG25832_to_WGS84: function(x, y, zone, sh) {
				var latLng = new Array(2);
				zone = zone || 32;
	      if ((zone < 1) || (60 < zone)) {
          alert ("The UTM zone you entered is out of range.  " +
                   "Please enter a number in the range [1, 60].");
            return false;
        }
        sh = sh || false;
        this.UTMXYToLatLng(x, y, zone, sh, latLng);
				return { lat: this.radToDeg(latLng[1]), lng: this.radToDeg(latLng[0]) }
  	  }

			/*,
			polygonCenter: function (arr) {
		    var twoTimesSignedArea = 0;
		    var cxTimes6SignedArea = 0;
		    var cyTimes6SignedArea = 0;
		
		    var length = arr.length

		    var x = function (i) { return arr[i % length][0] };
		    var y = function (i) { return arr[i % length][1] };

		    for ( var i = 0; i < arr.length; i++) {
	        var twoSA = x(i)*y(i+1) - x(i+1)*y(i);
	        twoTimesSignedArea += twoSA;
	        cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
	        cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
		    }
		    var sixSignedArea = 3 * twoTimesSignedArea;
		    return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];        
			}
			*/

		}
	});

'use strict';

/**
 * @ngdoc directive
 * @name myrejagtenApp.directive:institutionTypeahead
 * @description
 * # institutionTypeahead
 */
angular.module('myrejagtenApp')
	.directive('institutionTypeahead', function () {
		return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			$(element).typeahead({
				afterSelect: function (item) {
					console.log('institution selected', item);
					var login = "davidkonrad", 
							password = "nhmdzm",
							url = 'https://services.kortforsyningen.dk/Geosearch?search&geometryWkt='+item.geometryWkt+'&resources=adresser&limit=10&login='+login+'&password='+password;
		
						//var geojsonLayer = L.geoJson(parse(item.geometryWkt));


				    $.getJSON(url, function(resp) {
								console.log(resp);
						})

				}, 
				items : 20,
				displayText: function(item) {
						return item.presentationString
				},
			  source: function(query, process) {
					//TODO: run service with tickets instead of hardcoded username / password
					var login = "davidkonrad", 
							password = "nhmdzm",
							url = 'https://services.kortforsyningen.dk/Geosearch?search=*'+query+'*&resources=stednavne_v2&limit=100&login='+login+'&password='+password;

			    return $.getJSON(url, function(resp) {
							var newData = [],
									types = ['gymnasium', 'uddannelsescenter', 'privatskoleFriskole', 'folkeskole', 'universitet', 'specialskole']
							for (var i in resp.data) {
								//console.log(resp.data[i]);
								//console.log(resp.data[i].type, resp.data[i].subtype);
								if (~types.indexOf(resp.data[i].type) || ~types.indexOf(resp.data[i].subtype)) {
									//console.log(resp.data[i]);
									//newData.push(resp.data[i].presentationString);
									newData.push(resp.data[i]);
								}
							}			
							return process(newData);		
				    })
				  }
				})
			}
		}
})

'use strict';

/**
 * @ngdoc directive
 * @name dnaApp.directive:wtlandTypeahead
 * @description
 * # wetlandTypeahead
 */

function splice(str, pos, insert) {
	return str.substr(0, pos) + insert + str.substr(pos)
}

angular.module('myrejagtenApp').directive('wetlandTypeahead', function () {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			$(element).typeahead({
				displayText: function(item) {
					return splice(item.presentationString, item.presentationString.indexOf('(')+1, item.subtype+', ')
				},
				afterSelect: function(item) {
					console.log(attrs);
					//ngModel = item;
					//attrs.wetlandTypeahead = item;
				}, 
				items : 20,
			  source: function(query, process) {
					//TODO: run service with tickets instead of hardcoded username / password
					var login = "davidkonrad", 
							password = "nhmdzm",
							url = 'https://services.kortforsyningen.dk/Geosearch?search='+query+'*&resources=stednavne_v2&limit=100&login='+login+'&password='+password;
	
			    return $.getJSON(url, function(resp) {
						var data = [], 
								caption = '', 
								types = ['sø', 'vandløb', 'vandloeb', 'soe', 'å', 'kilde', 'hav', 'fjord', 'bæk', 'mose', 'sump', 'moseSump']
	
						for (var i in resp.data) {
							if (~types.indexOf(resp.data[i].type) || ~types.indexOf(resp.data[i].subtype)) {
								data.push(resp.data[i]);
							} else {
								//console.log(resp.data[i].subtype);
							}
						}			
						return process(data);		
			    })
			  }
			})
		}
	}
})

'use strict';

angular.module('myrejagtenApp')
  .controller('ForsoegCtrl', ['$scope', '$compile', '$timeout', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	 function($scope, $compile, $timeout, $modal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {


  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/forsøg', {
        templateUrl: 'app/forsoeg/forsoeg.html',
        controller: 'ForsoegCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .factory('ForsoegModal', ['$modal', '$q', '$timeout', function($modal, $q, $timeout) {

		var deferred = null,
				kommentar = null,
				modal = null;

		return {
			new: function($scope) {
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/forsoegModal/forsoegModal.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					//kommentar = angular.element('#kommentar')
					$timeout(function() {
						//kommentar.focus()
					})
				})
		
				$scope.forsoegModalOk = function() {
					modal.hide()
		      deferred.resolve(true)
				}

				$scope.forsoegModalCancel = function() {
					modal.hide()
				}

	      return deferred.promise;
			}
		}

	}]);



'use strict';

angular.module('myrejagtenApp')
  .controller('MainCtrl', ['$scope', '$compile', '$timeout', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	 function($scope, $compile, $timeout, $modal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {


  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .controller('MyPageCtrl', ['$scope', '$compile', '$timeout', '$modal', 'ForsoegModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, ForsoegModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	$scope.createForsoeg = function() {
		ForsoegModal.new($scope).then(function(created) {		
			alert(created)
		})
	}
	

  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/mine-forsøg', {
        templateUrl: 'app/mypage/mypage.html',
        controller: 'MyPageCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .factory('ProeveNr', ['$modal', '$q', '$timeout', 'Proeve', function($modal, $q, $timeout, Proeve) {

		var deferred = null,
				modal = null,
				input = null,
				current_proeve_nr = null,
				proever = null;

		function loadProever() {
			Proeve.query().$promise.then(function(p) {
				proever = p	
			})
		}

		function proeveNrExists(proeve_nr) {
			for (var i=0;i<proever.length;i++) {
				if (proever[i].proeve_nr == proeve_nr) return true
			}
			return false
		}

		return {
			
			change: function($scope, proeve_nr) {
				loadProever()
				current_proeve_nr = proeve_nr

				$scope.proeveNrModal = {
					title: 'Ret prøveNr ..',
					message: 'Skriv nyt (unikt) prøveNr :',
					canSubmit: false,
					proeve_nr: proeve_nr
				}

				$scope.$watch('proeveNrModal.proeve_nr', function(newVal, oldVal) {
					//what the heck, why not use jQuery since it is loaded anyway
					var $input = $('#modal-proeveNr-input'),
							$glyph = $('#modal-proeveNr-glyph'),
							$exists = $('#modal-proeveNr-exists');

					function ok() {
						$input.removeClass('has-error').addClass('has-success')
		        $glyph.removeClass('glyphicon-remove').addClass('glyphicon-ok');         
						$exists.hide()
						$scope.proeveNrModal.canSubmit = true
					}
					function error() {
						$input.removeClass('has-success').addClass('has-error')
		        $glyph.removeClass('glyphicon-ok').addClass('glyphicon-remove');         
						$exists.show()
						$scope.proeveNrModal.canSubmit = false
					}

					if (newVal != oldVal) {
						if (proeveNrExists(newVal)) {
							if (newVal != current_proeve_nr) {
								error()
							} else {
								ok()
								//disallow submit id unchanged
								$scope.proeveNrModal.canSubmit = false
							}
						} else {
							ok()
						}
					}
				}) 

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/proeveNr/proeveNr.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.proeveNrClose = function(success) {
					modal.hide()
		      deferred.resolve(success ? $scope.proeveNrModal.proeve_nr : false)
				}

	      return deferred.promise;
			},

			/**
				this should REALLY be trivialised 
			**/
			create: function($scope) {
				loadProever()

				$scope.proeveNrModal = {
					title: 'Opret ny prøve ..',
					message: 'Skriv nyt (unikt) prøveNr :',
					canSubmit: false,
					proeve_nr: null
				}

				$scope.$watch('proeveNrModal.proeve_nr', function(newVal, oldVal) {
					var $input = $('#modal-proeveNr-input'),
							$glyph = $('#modal-proeveNr-glyph'),
							$exists = $('#modal-proeveNr-exists');

					function ok() {
						$input.removeClass('has-error').addClass('has-success')
		        $glyph.removeClass('glyphicon-remove').addClass('glyphicon-ok');         
						$exists.hide()
						$scope.proeveNrModal.canSubmit = true
					}
					function error() {
						$input.removeClass('has-success').addClass('has-error')
		        $glyph.removeClass('glyphicon-ok').addClass('glyphicon-remove');         
						$exists.show()
						$scope.proeveNrModal.canSubmit = false
					}

					if (newVal != oldVal) {
						if (newVal == '') {
							error()
							$exists.hide()
							return
						}
						if (proeveNrExists(newVal)) {
							error()
						} else {
							ok()
						}
					}
				}) 

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/proeveNr/proeveNr.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					$timeout(function() {
						$scope.proeveNrModal.proeve_nr = ''
						angular.element('#input').focus()
					}, 100)
				})

				$scope.proeveNrClose = function(success) {
					modal.hide()
		      deferred.resolve(success ? $scope.proeveNrModal.proeve_nr : false)
				}

	      return deferred.promise;
			},

			/** attach resultat to ... **/
			attachTo: function($scope) {
				loadProever()

				$scope.proeveNrModal = {
					title: 'Opret nyt Resultat for Prøve ..',
					message: 'Vælg eksisterende Prøve eller opret ny :',
					canSubmit: false,
					willCreate: false,
					proeve_nr: '',
					proeve_id: null
				}

				$scope.$watchGroup(['proeveNrModal.proeve_nr', 'proeveNrModal.willCreate'], function(newVal, oldVal) {
					var $input = $('#modal-proeveNr-input'),
							$glyph = $('#modal-proeveNr-glyph'),
							$create = $('#modal-proeveNr-create');

					function ok() {
						$input.removeClass('has-error').addClass('has-success')
		        $glyph.removeClass('glyphicon-remove').addClass('glyphicon-ok');         
						$create.hide()
						$scope.proeveNrModal.canSubmit = true
					}
					function error() {
						$input.removeClass('has-success').addClass('has-error')
		        $glyph.removeClass('glyphicon-ok').addClass('glyphicon-remove');         
						$create.show()
						$scope.proeveNrModal.canSubmit = false
					}

					if ($scope.proeveNrModal.proeve_nr == '') {
						error()
						$create.hide()
						return
					}
					if (proeveNrExists($scope.proeveNrModal.proeve_nr)) {
						ok()
					} else {
						if ($scope.proeveNrModal.willCreate) {
							ok()
							$create.show()
						} else {
							error()
						}
					}
				}) 

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/proeveNr/proeveNr.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					$timeout(function() {
						$('#input').typeahead({
							showHintOnFocus: true,
							source: proever,
							displayText: function(item) {
								return item.proeve_nr != null ? item.proeve_nr : ''
							},
							items: 15,
							afterSelect: function(item) {
								$timeout(function() {
									$scope.proeveNrModal.proeve_nr = item.proeve_nr
									$scope.proeveNrModal.proeve_id = item.proeve_id
									$scope.proeveNrModal.willCreate = false
								})
							}
						})
						$scope.proeveNrModal.proeve_nr = ''
						angular.element('#input').focus()
					}, 100)
				})

				$scope.proeveNrClose = function(success) {
					modal.hide()
					if (success) {
						var result = $scope.proeveNrModal.willCreate ? $scope.proeveNrModal.proeve_nr : $scope.proeveNrModal.proeve_id 
					} else {
						result = false
					}
		      deferred.resolve(result)
				}
	
	      return deferred.promise;

			}
		}

	}]);



'use strict';

angular.module('myrejagtenApp')
  .controller('ProjektCtrl', ['$scope', '$compile', '$timeout', '$modal', 'ForsoegModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, ForsoegModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	

  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/mine-eksperimenter', {
        templateUrl: 'app/projekt/projekt.html',
        controller: 'ProjektCtrl'
      });
  }]);

'use strict';

angular.module('myrejagtenApp')
  .factory('SagsNo', ['$modal', '$q', '$timeout', 'Booking', function($modal, $q, $timeout, Booking) {

		var deferred = null,
				modal = null,
				input = null,
				current_sagsNo = null,
				bookings = null;

		function loadBookings() {
			Booking.query().$promise.then(function(p) {
				bookings = p	
			})
		}

		function sagsNoExists(sagsNo) {
			for (var i=0;i<bookings.length;i++) {
				if (bookings[i].sagsNo == sagsNo) return true
			}
			return false
		}

		return {

			change: function($scope, sagsNo) {
				loadBookings()
				current_sagsNo = sagsNo

				$scope.sagsNoModal = {
					title: 'Ret sagsNr ..',
					message: 'Skriv nyt (unikt) sagsNrr :',
					canSubmit: false,
					sagsNo: sagsNo
				}

				$scope.$watch('sagsNoModal.sagsNo', function(newVal, oldVal) {
					//what the heck, why not use jQuery since it is loaded anyway
					var $input = $('#modal-sagsNo-input'),
							$glyph = $('#modal-sagsNo-glyph'),
							$exists = $('#modal-sagsNo-exists');

					function ok() {
						$input.removeClass('has-error').addClass('has-success')
		        $glyph.removeClass('glyphicon-remove').addClass('glyphicon-ok');         
						$exists.hide()
						$scope.sagsNoModal.canSubmit = true
					}
					function error() {
						$input.removeClass('has-success').addClass('has-error')
		        $glyph.removeClass('glyphicon-ok').addClass('glyphicon-remove');         
						$exists.show()
						$scope.sagsNoModal.canSubmit = false
					}

					if (newVal != oldVal) {
						if (sagsNoExists(newVal)) {
							if (newVal != current_sagsNo) {
								error()
							} else {
								ok()
								//disallow submit id unchanged
								$scope.sagsNoModal.canSubmit = false
							}
						} else {
							ok()
						}
					}
				}) 

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/sagsNo/sagsNo.modal.html',
					backdrop: 'static',
					show: true
				})

				$scope.sagsNoClose = function(success) {
					modal.hide()
		      deferred.resolve(success ? $scope.sagsNoModal.sagsNo : false)
				}

	      return deferred.promise;
			},

			/**
				this should REALLY be trivialised 
			**/
			create: function($scope) {
				loadBookings()

				$scope.sagsNoModal = {
					title: 'Opret ny Booking ..',
					message: 'Skriv nyt (unikt) sagsNr :',
					canSubmit: false,
					sagsNo: null
				}

				$scope.$watch('sagsNoModal.sagsNo', function(newVal, oldVal) {
					var $input = $('#modal-sagsNo-input'),
							$glyph = $('#modal-sagsNo-glyph'),
							$exists = $('#modal-sagsNo-exists');

					function ok() {
						$input.removeClass('has-error').addClass('has-success')
		        $glyph.removeClass('glyphicon-remove').addClass('glyphicon-ok');         
						$exists.hide()
						$scope.sagsNoModal.canSubmit = true
					}
					function error() {
						$input.removeClass('has-success').addClass('has-error')
		        $glyph.removeClass('glyphicon-ok').addClass('glyphicon-remove');         
						$exists.show()
						$scope.sagsNoModal.canSubmit = false
					}

					if (newVal != oldVal) {
						if (newVal == '') {
							error()
							$exists.hide()
							return
						}
						if (sagsNoExists(newVal)) {
							error()
						} else {
							ok()
						}
					}
				}) 

				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'app/sagsNo/sagsNo.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					$timeout(function() {
						$scope.sagsNoModal.sagsNo = 'F16-'
						angular.element('#input').focus()
					}, 100)
				})

				$scope.sagsNoClose = function(success) {
					modal.hide()
		      deferred.resolve(success ? $scope.sagsNoModal.sagsNo : false)
				}

	      return deferred.promise;
			}

		}
		
	}]);



'use strict';

angular.module('myrejagtenApp')
  .controller('TilmeldCtrl', ['$scope', '$compile', '$timeout', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
	function($scope, $compile, $timeout, $modal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

	

  }]);

'use strict';

angular.module('myrejagtenApp')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/tilmeld', {
        templateUrl: 'app/tilmeld/tilmeld.html',
        controller: 'TilmeldCtrl'
      });
  }]);

/*! 
 * angular-hotkeys v1.4.5
 * https://chieffancypants.github.io/angular-hotkeys
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
/*
 * angular-hotkeys
 *
 * Automatic keyboard shortcuts for your angular apps
 *
 * (c) 2014 Wes Cruver
 * License: MIT
 */

(function() {

  'use strict';

  angular.module('cfp.hotkeys', []).provider('hotkeys', function() {

    /**
     * Configurable setting to disable the cheatsheet entirely
     * @type {Boolean}
     */
    this.includeCheatSheet = true;

    /**
     * Configurable setting for the cheat sheet title
     * @type {String}
     */

    this.templateTitle = 'Keyboard Shortcuts:';

    /**
     * Cheat sheet template in the event you want to totally customize it.
     * @type {String}
     */
    this.template = '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys">' +
                      '<h4 class="cfp-hotkeys-title">{{ title }}</h4>' +
                      '<table><tbody>' +
                        '<tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">' +
                          '<td class="cfp-hotkeys-keys">' +
                            '<span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>' +
                          '</td>' +
                          '<td class="cfp-hotkeys-text">{{ hotkey.description }}</td>' +
                        '</tr>' +
                      '</tbody></table>' +
                      '<div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">×</div>' +
                    '</div></div>';

    /**
     * Configurable setting for the cheat sheet hotkey
     * @type {String}
     */
    this.cheatSheetHotkey = '?';

    /**
     * Configurable setting for the cheat sheet description
     * @type {String}
     */
    this.cheatSheetDescription = 'Show / hide this help menu';

    this.$get = ['$rootElement', '$rootScope', '$compile', '$window', '$document', function ($rootElement, $rootScope, $compile, $window, $document) {

      // monkeypatch Mousetrap's stopCallback() function
      // this version doesn't return true when the element is an INPUT, SELECT, or TEXTAREA
      // (instead we will perform this check per-key in the _add() method)
      Mousetrap.stopCallback = function(event, element) {
        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
          return false;
        }

        return (element.contentEditable && element.contentEditable == 'true');
      };

      /**
       * Convert strings like cmd into symbols like ⌘
       * @param  {String} combo Key combination, e.g. 'mod+f'
       * @return {String}       The key combination with symbols
       */
      function symbolize (combo) {
        var map = {
          command   : '⌘',
          shift     : '⇧',
          left      : '←',
          right     : '→',
          up        : '↑',
          down      : '↓',
          'return'  : '↩',
          backspace : '⌫'
        };
        combo = combo.split('+');

        for (var i = 0; i < combo.length; i++) {
          // try to resolve command / ctrl based on OS:
          if (combo[i] === 'mod') {
            if ($window.navigator && $window.navigator.platform.indexOf('Mac') >=0 ) {
              combo[i] = 'command';
            } else {
              combo[i] = 'ctrl';
            }
          }

          combo[i] = map[combo[i]] || combo[i];
        }

        return combo.join(' + ');
      }

      /**
       * Hotkey object used internally for consistency
       *
       * @param {array}    combo       The keycombo. it's an array to support multiple combos
       * @param {String}   description Description for the keycombo
       * @param {Function} callback    function to execute when keycombo pressed
       * @param {string}   action      the type of event to listen for (for mousetrap)
       * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
       * @param {Boolean}  persistent  Whether the hotkey persists navigation events
       */
      function Hotkey (combo, description, callback, action, allowIn, persistent) {
        // TODO: Check that the values are sane because we could
        // be trying to instantiate a new Hotkey with outside dev's
        // supplied values

        this.combo = combo instanceof Array ? combo : [combo];
        this.description = description;
        this.callback = callback;
        this.action = action;
        this.allowIn = allowIn;
        this.persistent = persistent;
      }

      /**
       * Helper method to format (symbolize) the key combo for display
       *
       * @return {[Array]} An array of the key combination sequence
       *   for example: "command+g c i" becomes ["⌘ + g", "c", "i"]
       *
       * TODO: this gets called a lot.  We should cache the result
       */
      Hotkey.prototype.format = function() {

        // Don't show all the possible key combos, just the first one.  Not sure
        // of usecase here, so open a ticket if my assumptions are wrong
        var combo = this.combo[0];

        var sequence = combo.split(/[\s]/);
        for (var i = 0; i < sequence.length; i++) {
          sequence[i] = symbolize(sequence[i]);
        }

        return sequence;
      };

      /**
       * A new scope used internally for the cheatsheet
       * @type {$rootScope.Scope}
       */
      var scope = $rootScope.$new();

      /**
       * Holds an array of Hotkey objects currently bound
       * @type {Array}
       */
      scope.hotkeys = [];

      /**
       * Contains the state of the help's visibility
       * @type {Boolean}
       */
      scope.helpVisible = false;

      /**
       * Holds the title string for the help menu
       * @type {String}
       */
      scope.title = this.templateTitle;

      /**
       * Expose toggleCheatSheet to hotkeys scope so we can call it using
       * ng-click from the template
       * @type {function}
       */
      scope.toggleCheatSheet = toggleCheatSheet;


      /**
       * Holds references to the different scopes that have bound hotkeys
       * attached.  This is useful to catch when the scopes are `$destroy`d and
       * then automatically unbind the hotkey.
       *
       * @type {Array}
       */
      var boundScopes = [];


      $rootScope.$on('$routeChangeSuccess', function (event, route) {
        purgeHotkeys();

        if (route && route.hotkeys) {
          angular.forEach(route.hotkeys, function (hotkey) {
            // a string was given, which implies this is a function that is to be
            // $eval()'d within that controller's scope
            // TODO: hotkey here is super confusing.  sometimes a function (that gets turned into an array), sometimes a string
            var callback = hotkey[2];
            if (typeof(callback) === 'string' || callback instanceof String) {
              hotkey[2] = [callback, route];
            }

            // todo: perform check to make sure not already defined:
            // this came from a route, so it's likely not meant to be persistent
            hotkey[5] = false;
            _add.apply(this, hotkey);
          });
        }
      });


      // Auto-create a help menu:
      if (this.includeCheatSheet) {
        var document = $document[0];
        var element = $rootElement[0];
        var helpMenu = angular.element(this.template);
        _add(this.cheatSheetHotkey, this.cheatSheetDescription, toggleCheatSheet);

        // If $rootElement is document or documentElement, then body must be used
        if (element === document || element === document.documentElement) {
          element = document.body;
        }

        angular.element(element).append($compile(helpMenu)(scope));
      }


      /**
       * Purges all non-persistent hotkeys (such as those defined in routes)
       *
       * Without this, the same hotkey would get recreated everytime
       * the route is accessed.
       */
      function purgeHotkeys() {
        var i = scope.hotkeys.length;
        while (i--) {
          var hotkey = scope.hotkeys[i];
          if (hotkey && !hotkey.persistent) {
            _del(hotkey);
          }
        }
      }

      /**
       * Toggles the help menu element's visiblity
       */
      var previousEsc = false;

      function toggleCheatSheet() {
        scope.helpVisible = !scope.helpVisible;

        // Bind to esc to remove the cheat sheet.  Ideally, this would be done
        // as a directive in the template, but that would create a nasty
        // circular dependency issue that I don't feel like sorting out.
        if (scope.helpVisible) {
          previousEsc = _get('esc');
          _del('esc');

          // Here's an odd way to do this: we're going to use the original
          // description of the hotkey on the cheat sheet so that it shows up.
          // without it, no entry for esc will ever show up (#22)
          _add('esc', previousEsc.description, toggleCheatSheet);
        } else {
          _del('esc');

          // restore the previously bound ESC key
          if (previousEsc !== false) {
            _add(previousEsc);
          }
        }
      }

      /**
       * Creates a new Hotkey and creates the Mousetrap binding
       *
       * @param {string}   combo       mousetrap key binding
       * @param {string}   description description for the help menu
       * @param {Function} callback    method to call when key is pressed
       * @param {string}   action      the type of event to listen for (for mousetrap)
       * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
       * @param {boolean}  persistent  if true, the binding is preserved upon route changes
       */
      function _add (combo, description, callback, action, allowIn, persistent) {

        // used to save original callback for "allowIn" wrapping:
        var _callback;

        // these elements are prevented by the default Mousetrap.stopCallback():
        var preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

        // Determine if object format was given:
        var objType = Object.prototype.toString.call(combo);

        if (objType === '[object Object]') {
          description = combo.description;
          callback    = combo.callback;
          action      = combo.action;
          persistent  = combo.persistent;
          allowIn     = combo.allowIn;
          combo       = combo.combo;
        }

        // description is optional:
        if (description instanceof Function) {
          action = callback;
          callback = description;
          description = '$$undefined$$';
        } else if (angular.isUndefined(description)) {
          description = '$$undefined$$';
        }

        // any items added through the public API are for controllers
        // that persist through navigation, and thus undefined should mean
        // true in this case.
        if (persistent === undefined) {
          persistent = true;
        }

        // if callback is defined, then wrap it in a function
        // that checks if the event originated from a form element.
        // the function blocks the callback from executing unless the element is specified
        // in allowIn (emulates Mousetrap.stopCallback() on a per-key level)
        if (typeof callback === 'function') {

          // save the original callback
          _callback = callback;

          // make sure allowIn is an array
          if (!(allowIn instanceof Array)) {
            allowIn = [];
          }

          // remove anything from preventIn that's present in allowIn
          var index;
          for (var i=0; i < allowIn.length; i++) {
            allowIn[i] = allowIn[i].toUpperCase();
            index = preventIn.indexOf(allowIn[i]);
            if (index !== -1) {
              preventIn.splice(index, 1);
            }
          }

          // create the new wrapper callback
          callback = function(event) {
            var shouldExecute = true;
            var target = event.target || event.srcElement; // srcElement is IE only
            var nodeName = target.nodeName.toUpperCase();

            // check if the input has a mousetrap class, and skip checking preventIn if so
            if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
              shouldExecute = true;
            } else {
              // don't execute callback if the event was fired from inside an element listed in preventIn
              for (var i=0; i<preventIn.length; i++) {
                if (preventIn[i] === nodeName) {
                  shouldExecute = false;
                  break;
                }
              }
            }

            if (shouldExecute) {
              wrapApply(_callback.apply(this, arguments));
            }
          };
        }

        if (typeof(action) === 'string') {
          Mousetrap.bind(combo, wrapApply(callback), action);
        } else {
          Mousetrap.bind(combo, wrapApply(callback));
        }

        var hotkey = new Hotkey(combo, description, callback, action, allowIn, persistent);
        scope.hotkeys.push(hotkey);
        return hotkey;
      }

      /**
       * delete and unbind a Hotkey
       *
       * @param  {mixed} hotkey   Either the bound key or an instance of Hotkey
       * @return {boolean}        true if successful
       */
      function _del (hotkey) {
        var combo = (hotkey instanceof Hotkey) ? hotkey.combo : hotkey;

        Mousetrap.unbind(combo);

        if (angular.isArray(combo)) {
          var retStatus = true;
          var i = combo.length;
          while (i--) {
            retStatus = _del(combo[i]) && retStatus;
          }
          return retStatus;
        } else {
          var index = scope.hotkeys.indexOf(_get(combo));

          if (index > -1) {
            // if the combo has other combos bound, don't unbind the whole thing, just the one combo:
            if (scope.hotkeys[index].combo.length > 1) {
              scope.hotkeys[index].combo.splice(scope.hotkeys[index].combo.indexOf(combo), 1);
            } else {
              scope.hotkeys.splice(index, 1);
            }
            return true;
          }
        }

        return false;

      }

      /**
       * Get a Hotkey object by key binding
       *
       * @param  {[string]} combo  the key the Hotkey is bound to
       * @return {Hotkey}          The Hotkey object
       */
      function _get (combo) {

        var hotkey;

        for (var i = 0; i < scope.hotkeys.length; i++) {
          hotkey = scope.hotkeys[i];

          if (hotkey.combo.indexOf(combo) > -1) {
            return hotkey;
          }
        }

        return false;
      }

      /**
       * Binds the hotkey to a particular scope.  Useful if the scope is
       * destroyed, we can automatically destroy the hotkey binding.
       *
       * @param  {Object} scope The scope to bind to
       */
      function bindTo (scope) {
        // Only initialize once to allow multiple calls for same scope.
        if (!(scope.$id in boundScopes)) {

          // Add the scope to the list of bound scopes
          boundScopes[scope.$id] = [];

          scope.$on('$destroy', function () {
            var i = boundScopes[scope.$id].length;
            while (i--) {
              _del(boundScopes[scope.$id][i]);
              delete boundScopes[scope.$id][i];
            }
          });
        }
        // return an object with an add function so we can keep track of the
        // hotkeys and their scope that we added via this chaining method
        return {
          add: function (args) {
            var hotkey;

            if (arguments.length > 1) {
              hotkey = _add.apply(this, arguments);
            } else {
              hotkey = _add(args);
            }

            boundScopes[scope.$id].push(hotkey);
            return this;
          }
        };
      }

      /**
       * All callbacks sent to Mousetrap are wrapped using this function
       * so that we can force a $scope.$apply()
       *
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      function wrapApply (callback) {
        // return mousetrap a function to call
        return function (event, combo) {

          // if this is an array, it means we provided a route object
          // because the scope wasn't available yet, so rewrap the callback
          // now that the scope is available:
          if (callback instanceof Array) {
            var funcString = callback[0];
            var route = callback[1];
            callback = function (event) {
              route.scope.$eval(funcString);
            };
          }

          // this takes place outside angular, so we'll have to call
          // $apply() to make sure angular's digest happens
          $rootScope.$apply(function() {
            // call the original hotkey callback with the keyboard event
            callback(event, _get(combo));
          });
        };
      }


      var publicApi = {
        add                   : _add,
        del                   : _del,
        get                   : _get,
        bindTo                : bindTo,
        template              : this.template,
        toggleCheatSheet      : toggleCheatSheet,
        includeCheatSheet     : this.includeCheatSheet,
        cheatSheetHotkey      : this.cheatSheetHotkey,
        cheatSheetDescription : this.cheatSheetDescription,
        purgeHotkeys          : purgeHotkeys,
        templateTitle         : this.templateTitle
      };

      return publicApi;

    }];
  })

  .directive('hotkey', ['hotkeys', function (hotkeys) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {
        var key, allowIn;

        angular.forEach(scope.$eval(attrs.hotkey), function (func, hotkey) {
          // split and trim the hotkeys string into array
          allowIn = typeof attrs.hotkeyAllowIn === "string" ? attrs.hotkeyAllowIn.split(/[\s,]+/) : [];

          key = hotkey;

          hotkeys.add({
            combo: hotkey,
            description: attrs.hotkeyDescription,
            callback: func,
            action: attrs.hotkeyAction,
            allowIn: allowIn
          });
        });

        // remove the hotkey if the directive is destroyed:
        el.bind('$destroy', function() {
          hotkeys.del(key);
        });
      }
    };
  }])

  .run(['hotkeys', function(hotkeys) {
    // force hotkeys to run by injecting it. Without this, hotkeys only runs
    // when a controller or something else asks for it via DI.
  }]);

})();

/*global define:false */
/**
 * Copyright 2013 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.4.6
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },

        /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
        _KEYCODE_MAP = {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111 : '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        },

        /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
        _SHIFT_MAP = {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            ':': ';',
            '\"': '\'',
            '<': ',',
            '>': '.',
            '?': '/',
            '|': '\\'
        },

        /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
        _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc',
            'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
        },

        /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
        _REVERSE_MAP,

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        _callbacks = {},

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        _directMap = {},

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        _sequenceLevels = {},

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        _resetTimer,

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        _ignoreNextKeyup = false,

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        _ignoreNextKeypress = false,

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        _nextExpectedAction = false;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i;
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * resets all sequence counters except for the ones passed in
     *
     * @param {Object} doNotReset
     * @returns void
     */
    function _resetSequences(doNotReset) {
        doNotReset = doNotReset || {};

        var activeSequences = false,
            key;

        for (key in _sequenceLevels) {
            if (doNotReset[key]) {
                activeSequences = true;
                continue;
            }
            _sequenceLevels[key] = 0;
        }

        if (!activeSequences) {
            _nextExpectedAction = false;
        }
    }

    /**
     * finds all callbacks that match based on the keycode, modifiers,
     * and action
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event|Object} e
     * @param {string=} sequenceName - name of the sequence we are looking for
     * @param {string=} combination
     * @param {number=} level
     * @returns {Array}
     */
    function _getMatches(character, modifiers, e, sequenceName, combination, level) {
        var i,
            callback,
            matches = [],
            action = e.type;

        // if there are no events related to this keycode
        if (!_callbacks[character]) {
            return [];
        }

        // if a modifier key is coming up on its own we should allow it
        if (action == 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        // loop through all callbacks for the key that was pressed
        // and see if any of them match
        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];

            // if a sequence name is not specified, but this is a sequence at
            // the wrong level then move onto the next match
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                continue;
            }

            // if the action we are looking for doesn't match the action we got
            // then we should keep going
            if (action != callback.action) {
                continue;
            }

            // if this is a keypress event and the meta key and control key
            // are not pressed that means that we need to only look at the
            // character, otherwise check the modifiers as well
            //
            // chrome will not fire a keypress if meta or control is down
            // safari will fire a keypress if meta or meta+shift is down
            // firefox will fire a keypress if meta or control is down
            if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                // when you bind a combination or sequence a second time it
                // should overwrite the first one.  if a sequenceName or
                // combination is specified in this call it does just that
                //
                // @todo make deleting its own method?
                var deleteCombo = !sequenceName && callback.combo == combination;
                var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                if (deleteCombo || deleteSequence) {
                    _callbacks[character].splice(i, 1);
                }

                matches.push(callback);
            }
        }

        return matches;
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * actually calls the callback function
     *
     * if your callback function returns false this will use the jquery
     * convention - prevent default and stop propogation on the event
     *
     * @param {Function} callback
     * @param {Event} e
     * @returns void
     */
    function _fireCallback(callback, e, combo, sequence) {

        // if this event should not happen stop here
        if (Mousetrap.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
            return;
        }

        if (callback(e, combo) === false) {
            _preventDefault(e);
            _stopPropagation(e);
        }
    }

    /**
     * handles a character key event
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event} e
     * @returns void
     */
    function _handleKey(character, modifiers, e) {
        var callbacks = _getMatches(character, modifiers, e),
            i,
            doNotReset = {},
            maxLevel = 0,
            processedSequenceCallback = false;

        // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                maxLevel = Math.max(maxLevel, callbacks[i].level);
            }
        }

        // loop through matching callbacks for this key event
        for (i = 0; i < callbacks.length; ++i) {

            // fire for all sequence callbacks
            // this is because if for example you have multiple sequences
            // bound such as "g i" and "g t" they both need to fire the
            // callback for matching g cause otherwise you can only ever
            // match the first one
            if (callbacks[i].seq) {

                // only fire callbacks for the maxLevel to prevent
                // subsequences from also firing
                //
                // for example 'a option b' should not cause 'option b' to fire
                // even though 'option b' is part of the other sequence
                //
                // any sequences that do not match here will be discarded
                // below by the _resetSequences call
                if (callbacks[i].level != maxLevel) {
                    continue;
                }

                processedSequenceCallback = true;

                // keep a list of which sequences were matches for later
                doNotReset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                continue;
            }

            // if there were no sequence matches but we are still here
            // that means this is a regular match so we should fire that
            if (!processedSequenceCallback) {
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
            }
        }

        // if the key you pressed matches the type of sequence without
        // being a modifier (ie "keyup" or "keypress") then we should
        // reset all sequences that were not matched by this event
        //
        // this is so, for example, if you have the sequence "h a t" and you
        // type "h e a r t" it does not match.  in this case the "e" will
        // cause the sequence to reset
        //
        // modifier keys are ignored because you can have a sequence
        // that contains modifiers such as "enter ctrl+space" and in most
        // cases the modifier key will be pressed before the next key
        //
        // also if you have a sequence such as "ctrl+b a" then pressing the
        // "b" key will trigger a "keypress" and a "keydown"
        //
        // the "keydown" is expected when there is a modifier, but the
        // "keypress" ends up matching the _nextExpectedAction since it occurs
        // after and that causes the sequence to reset
        //
        // we ignore keypresses in a sequence that directly follow a keydown
        // for the same character
        var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
        if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
        }

        _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
    }

    /**
     * handles a keydown event
     *
     * @param {Event} e
     * @returns void
     */
    function _handleKeyEvent(e) {

        // normalize e.which for key events
        // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
        if (typeof e.which !== 'number') {
            e.which = e.keyCode;
        }

        var character = _characterFromEvent(e);

        // no character found then stop
        if (!character) {
            return;
        }

        // need to use === for the character check because the character can be 0
        if (e.type == 'keyup' && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
        }

        Mousetrap.handleKey(character, _eventModifiers(e), e);
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * called to set a 1 second timeout on the specified sequence
     *
     * this is so after each key press in the sequence you have 1 second
     * to press the next key before you have to start over
     *
     * @returns void
     */
    function _resetSequenceTimer() {
        clearTimeout(_resetTimer);
        _resetTimer = setTimeout(_resetSequences, 1000);
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * binds a key sequence to an event
     *
     * @param {string} combo - combo specified in bind call
     * @param {Array} keys
     * @param {Function} callback
     * @param {string=} action
     * @returns void
     */
    function _bindSequence(combo, keys, callback, action) {

        // start off by adding a sequence level record for this combination
        // and setting the level to 0
        _sequenceLevels[combo] = 0;

        /**
         * callback to increase the sequence level for this sequence and reset
         * all other sequences that were active
         *
         * @param {string} nextAction
         * @returns {Function}
         */
        function _increaseSequence(nextAction) {
            return function() {
                _nextExpectedAction = nextAction;
                ++_sequenceLevels[combo];
                _resetSequenceTimer();
            };
        }

        /**
         * wraps the specified callback inside of another function in order
         * to reset all sequence counters as soon as this sequence is done
         *
         * @param {Event} e
         * @returns void
         */
        function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);

            // we should ignore the next key up if the action is key down
            // or keypress.  this is so if you finish a sequence and
            // release the key the final key will not trigger a keyup
            if (action !== 'keyup') {
                _ignoreNextKeyup = _characterFromEvent(e);
            }

            // weird race condition if a sequence ends with the key
            // another sequence begins with
            setTimeout(_resetSequences, 10);
        }

        // loop through keys one at a time and bind the appropriate callback
        // function.  for any key leading up to the final one it should
        // increase the sequence. after the final, it should reset all sequences
        //
        // if an action is specified in the original bind call then that will
        // be used throughout.  otherwise we will pass the action that the
        // next key in the sequence should match.  this allows a sequence
        // to mix and match keypress and keydown events depending on which
        // ones are better suited to the key provided
        for (var i = 0; i < keys.length; ++i) {
            var isFinal = i + 1 === keys.length;
            var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
            _bindSingle(keys[i], wrappedCallback, action, combo, i);
        }
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys,
            key,
            i,
            modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    /**
     * binds a single keyboard combination
     *
     * @param {string} combination
     * @param {Function} callback
     * @param {string=} action
     * @param {string=} sequenceName - name of sequence if part of sequence
     * @param {number=} level - what part of the sequence the command is
     * @returns void
     */
    function _bindSingle(combination, callback, action, sequenceName, level) {

        // store a direct mapped reference for use with Mousetrap.trigger
        _directMap[combination + ':' + action] = callback;

        // make sure multiple spaces in a row become a single space
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            info;

        // if this pattern is a sequence of keys then run through this method
        // to reprocess each pattern one key at a time
        if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
        }

        info = _getKeyInfo(combination, action);

        // make sure to initialize array if this is the first time
        // a callback is added for this key
        _callbacks[info.key] = _callbacks[info.key] || [];

        // remove an existing match if there is one
        _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

        // add this call back to the array
        // if it is a sequence put it at the beginning
        // if not put it at the end
        //
        // this is important because the way these are processed expects
        // the sequence ones to come first
        _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
            callback: callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level: level,
            combo: combination
        });
    }

    /**
     * binds multiple combinations to the same callback
     *
     * @param {Array} combinations
     * @param {Function} callback
     * @param {string|undefined} action
     * @returns void
     */
    function _bindMultiple(combinations, callback, action) {
        for (var i = 0; i < combinations.length; ++i) {
            _bindSingle(combinations[i], callback, action);
        }
    }

    // start!
    _addEvent(document, 'keypress', _handleKeyEvent);
    _addEvent(document, 'keydown', _handleKeyEvent);
    _addEvent(document, 'keyup', _handleKeyEvent);

    var Mousetrap = {

        /**
         * binds an event to mousetrap
         *
         * can be a single key, a combination of keys separated with +,
         * an array of keys, or a sequence of keys separated by spaces
         *
         * be sure to list the modifier keys first to make sure that the
         * correct key ends up getting bound (the last key in the pattern)
         *
         * @param {string|Array} keys
         * @param {Function} callback
         * @param {string=} action - 'keypress', 'keydown', or 'keyup'
         * @returns void
         */
        bind: function(keys, callback, action) {
            keys = keys instanceof Array ? keys : [keys];
            _bindMultiple(keys, callback, action);
            return this;
        },

        /**
         * unbinds an event to mousetrap
         *
         * the unbinding sets the callback function of the specified key combo
         * to an empty function and deletes the corresponding key in the
         * _directMap dict.
         *
         * TODO: actually remove this from the _callbacks dictionary instead
         * of binding an empty function
         *
         * the keycombo+action has to be exactly the same as
         * it was defined in the bind method
         *
         * @param {string|Array} keys
         * @param {string} action
         * @returns void
         */
        unbind: function(keys, action) {
            return Mousetrap.bind(keys, function() {}, action);
        },

        /**
         * triggers an event that has already been bound
         *
         * @param {string} keys
         * @param {string=} action
         * @returns void
         */
        trigger: function(keys, action) {
            if (_directMap[keys + ':' + action]) {
                _directMap[keys + ':' + action]({}, keys);
            }
            return this;
        },

        /**
         * resets the library back to its initial state.  this is useful
         * if you want to clear out the current keyboard shortcuts and bind
         * new ones - for example if you switch to another page
         *
         * @returns void
         */
        reset: function() {
            _callbacks = {};
            _directMap = {};
            return this;
        },

       /**
        * should we stop this event before firing off callbacks
        *
        * @param {Event} e
        * @param {Element} element
        * @return {boolean}
        */
        stopCallback: function(e, element) {

            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }

            // stop for input, select, and textarea
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
        },

        /**
         * exposes _handleKey publicly so it can be overwritten by extensions
         */
        handleKey: _handleKey
    };

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Mousetrap);
    }
}) (window, document);

'use strict';

angular.module('myrejagtenApp')
  .factory('Auth', ["$location", "$rootScope", "$http", "User", "$cookieStore", "$q", function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      isAdmin: function() {
        return currentUser.role === 'Admin';
      },

      isUser: function() {
        return currentUser.role === 'User';
      },

      isGuest: function() {
        return currentUser.role === 'Guest';
      },

      mayEdit: function() {
				return !this.isGuest()
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  }]);

'use strict';

angular.module('myrejagtenApp')
  .factory('User', ["$resource", function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }	
      },
      update: {
        method: 'PUT'
      }

	  });
  }]);

/* =============================================================
 * bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2014 Bass Jobsen @bassjobsen
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


(function (root, factory) {

  'use strict';

  // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('jquery'));
  }
  // AMD module is defined
  else if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory ($);
    });
  } else {
    factory(root.jQuery);
  }

}(this, function ($) {

  'use strict';
  // jshint laxcomma: true


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.select = this.options.select || this.select;
    this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.render = this.options.render || this.render;
    this.updater = this.options.updater || this.updater;
    this.displayText = this.options.displayText || this.displayText;
    this.source = this.options.source;
    this.delay = this.options.delay;
    this.$menu = $(this.options.menu);
    this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
    this.shown = false;
    this.listen();
    this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' ? this.options.showHintOnFocus : false;
    this.afterSelect = this.options.afterSelect;
    this.addItem = false;
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.active').data('value');
      this.$element.data('active', val);
      if(this.autoSelect || val) {
        var newVal = this.updater(val);
        // Updater can be set to any random functions via "options" parameter in constructor above.
        // Add null check for cases when updater returns void or undefined.
        if (!newVal) {
          newVal = "";
        }
        this.$element
          .val(this.displayText(newVal) || newVal)
          .change();
        this.afterSelect(newVal);
      }
      return this.hide();
    },

    updater: function (item) {
      return item;
    },

    setSource: function (source) {
      this.source = source;
    },

    show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      }), scrollHeight;

      scrollHeight = typeof this.options.scrollHeight == 'function' ?
          this.options.scrollHeight.call() :
          this.options.scrollHeight;

      var element;
      if (this.shown) {
        element = this.$menu;
      } else if (this.$appendTo) {
        element = this.$menu.appendTo(this.$appendTo);
      } else {
        element = this.$menu.insertAfter(this.$element);
      }
      element.css({
          top: pos.top + pos.height + scrollHeight
        , left: pos.left
        })
        .show();

      this.shown = true;
      return this;
    },

    hide: function () {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (query) {
      var items;
      if (typeof(query) != 'undefined' && query !== null) {
        this.query = query;
      } else {
        this.query = this.$element.val() ||  '';
      }

      if (this.query.length < this.options.minLength && !this.options.showHintOnFocus) {
        return this.shown ? this.hide() : this;
      }

      var worker = $.proxy(function() {

        if($.isFunction(this.source)) this.process(this.source(this.query, $.proxy(this.process, this)));
        else if (this.source) {
          this.process(this.source);
        }
      }, this);

      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(worker, this.delay);
    },

    process: function (items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length && !this.options.addItem) {
        return this.shown ? this.hide() : this;
      }

      if (items.length > 0) {
        this.$element.data('active', items[0]);
      } else {
        this.$element.data('active', null);
      }

      // Add item
      if (this.options.addItem){
        items.push(this.options.addItem);
      }

      if (this.options.items == 'all') {
        return this.render(items).show();
      } else {
        return this.render(items.slice(0, this.options.items)).show();
      }
    },

    matcher: function (item) {
    var it = this.displayText(item);
      return ~it.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item;

      while ((item = items.shift())) {
        var it = this.displayText(item);
        if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~it.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (item) {
          var html = $('<div></div>');
          var query = this.query;
          var i = item.toLowerCase().indexOf(query.toLowerCase());
          var len, leftPart, middlePart, rightPart, strong;
          len = query.length;
          if(len === 0){
              return html.text(item).html();
          }
          while (i > -1) {
              leftPart = item.substr(0, i);
              middlePart = item.substr(i, len);
              rightPart = item.substr(i + len);
              strong = $('<strong></strong>').text(middlePart);
              html
                  .append(document.createTextNode(leftPart))
                  .append(strong);
              item = rightPart;
              i = item.toLowerCase().indexOf(query.toLowerCase());
          }
          return html.append(document.createTextNode(item)).html();
    },

    render: function (items) {
      var that = this;
      var self = this;
      var activeFound = false;
      var data = [];
      var _category = that.options.separator;

      $.each(items, function (key,value) {
        // inject separator
        if (key > 0 && value[_category] !== items[key - 1][_category]){
          data.push({
              __type: 'divider'
          });
        }

        // inject category header
        if (value[_category] && (key === 0 || value[_category] !== items[key - 1][_category])){
          data.push({
              __type: 'category',
              name: value[_category]
          });
        }
        data.push(value);
      });

      items = $(data).map(function (i, item) {

        if ((item.__type || false) == 'category'){
            return $(that.options.headerHtml).text(item.name)[0];
        }

        if ((item.__type || false) == 'divider'){
            return $(that.options.headerDivider)[0];
        }

        var text = self.displayText(item);
        i = $(that.options.item).data('value', item);
        i.find('a').html(that.highlighter(text, item));
        if (text == self.$element.val()) {
            i.addClass('active');
            self.$element.data('active', item);
            activeFound = true;
        }
        return i[0];
      });

      if (this.autoSelect && !activeFound) {
        items.filter(':not(.dropdown-header)').first().addClass('active');
        this.$element.data('active', items.first().data('value'));
      }
      this.$menu.html(items);
      return this;
    },

    displayText: function(item) {
      return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
    },

    next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    },

    prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    },

    listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    destroy : function () {
      this.$element.data('typeahead',null);
      this.$element.data('active',null);
      this.$element
        .off('focus')
        .off('blur')
        .off('keypress')
        .off('keyup');

      if (this.eventSupported('keydown')) {
        this.$element.off('keydown');
      }

      this.$menu.remove();
    },

    eventSupported: function(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) return;

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          // with the shiftKey (this is actually the left parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          // with the shiftKey (this is actually the right parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.next();
          break;
      }
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      if (!this.shown && e.keyCode == 40) {
        this.lookup();
      } else {
        this.move(e);
      }
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) return;
          this.select();
          break;

        case 27: // escape
          if (!this.shown) return;
          this.hide();
          break;
        default:
          this.lookup();
      }

      e.preventDefault();
   },

   focus: function (e) {
      if (!this.focused) {
        this.focused = true;
        if (this.options.showHintOnFocus) {
          this.lookup('');
        }
      }
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function (e) {
      e.preventDefault();
      this.select();
      this.hide();
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

  };


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    var arg = arguments;
     if (typeof option == 'string' && option == 'getActive') {
        return this.data('active');
     }
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
      if (typeof option == 'string') {
        if (arg.length > 1) {
          data[option].apply(data, Array.prototype.slice.call(arg ,1));
        } else {
          data[option]();
        }
      }
    });
  };

  $.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
        item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
        minLength: 1,
        scrollHeight: 0,
        autoSelect: true,
        afterSelect: $.noop,
        addItem: false,
        delay: 0,
        separator: 'category',
        headerHtml: '<li class="dropdown-header"></li>',
        headerDivider: '<li class="divider" role="separator"></li>'
  };

  $.fn.typeahead.Constructor = Typeahead;


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });

}));

'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('myrejagtenApp')
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });

'use strict';

angular.module('myrejagtenApp')
	.controller('NavbarCtrl', ["$rootScope", "$scope", "$location", "Auth", function($rootScope, $scope, $location, Auth) {

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isAdmin = Auth.isAdmin;
		$scope.getCurrentUser = Auth.getCurrentUser;
		$scope.user;

		$scope.logout = function() {
			Auth.logout();
			$location.path('/login');
		};

		$scope.isActive = function(route) {
			return route === $location.path();
		};

		$scope.getCurrentUser(function(user) {
			$scope.user = user;
		});

		$scope.$watch(Auth.isLoggedIn, function(newval, oldval) {
		})


	}]);

'use strict';

angular.module('myrejagtenApp')
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

/* global io */
'use strict';

angular.module('myrejagtenApp')
  .factory('socket', ["socketFactory", function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  }]);

angular.module('myrejagtenApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/account/login/login.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Login</h1></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required autofocus></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required> <span class=\"pull-right small\"><input type=checkbox id=rememberMe ng-checked=user.rememberMe ng-model=user.rememberMe><label for=rememberMe class=rememberMe>Husk mig</label></span></div><div class=\"form-group has-error\"><p class=help-block ng-show=\"form.email.$error.required && form.password.$error.required && submitted\">Please enter your email and password.</p><p class=help-block ng-show=\"form.email.$error.email && submitted\">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Login</button></div></form></div></div></div>"
  );


  $templateCache.put('app/account/settings/settings.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error autofocus><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)\">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class=\"btn btn-lg btn-primary\" type=submit>Save changes</button></form></div></div></div>"
  );


  $templateCache.put('app/account/signup/signup.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class=\"{ 'has-success': form.name.$valid && submitted,\n" +
    "                                            'has-error': form.name.$invalid && submitted }\"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show=\"form.name.$error.required && submitted\">A name is required</p></div><div class=form-group ng-class=\"{ 'has-success': form.email.$valid && submitted,\n" +
    "                                            'has-error': form.email.$invalid && submitted }\"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show=\"form.email.$error.email && submitted\">Doesn't look like a valid email.</p><p class=help-block ng-show=\"form.email.$error.required && submitted\">What's your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class=\"{ 'has-success': form.password.$valid && submitted,\n" +
    "                                            'has-error': form.password.$invalid && submitted }\"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show=\"(form.password.$error.minlength || form.password.$error.required) && submitted\">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Sign up</button> <a class=\"btn btn-default btn-lg btn-register\" href=/login>Login</a></div><hr><div><a class=\"btn btn-facebook\" href=\"\" ng-click=\"loginOauth('facebook')\"><i class=\"fa fa-facebook\"></i> Connect with Facebook</a> <a class=\"btn btn-google-plus\" href=\"\" ng-click=\"loginOauth('google')\"><i class=\"fa fa-google-plus\"></i> Connect with Google+</a> <a class=\"btn btn-twitter\" href=\"\" ng-click=\"loginOauth('twitter')\"><i class=\"fa fa-twitter\"></i> Connect with Twitter</a></div></form></div></div><hr></div>"
  );


  $templateCache.put('app/admin/admin.html',
    "<div class=container><div bs-tabs><div bs-pane data-title=\"Basis artsliste\"><div ng-include=\"'app/admin/taxon.tab.html'\"></div></div><div bs-pane data-title=Fag></div><div bs-pane data-title=Klassetrin></div></div></div>"
  );


  $templateCache.put('app/admin/password.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top\" tabindex=-1 role=dialog style=\"display: block\"><div class=modal-dialog><div class=modal-content><div class=modal-header>Edit password</div><div class=modal-body><form><input id=new-password class=form-control placeholder=\"Enter password\" ng-minlength=4 ng-maxlength=30 autofocus ng-enter=\"updatePassword(); $hide();\"><br><button type=button class=\"btn btn-danger\" ng-click=$hide()><i class=\"fa fa-times\"></i>&nbsp;Cancel</button> <button type=button class=\"btn btn-success\" ng-click=\"updatePassword(); $hide()\"><i class=\"fa fa-check\"></i>&nbsp;OK</button></form></div></div></div></div>"
  );


  $templateCache.put('app/admin/taxon.tab.html',
    "<style>td.check-col {\n" +
    "\tcolor:red;\n" +
    "\tmax-width: 40px !important;\n" +
    "\twidth: 40px !important;\n" +
    "\ttext-align: center;\n" +
    "}\n" +
    "table {\n" +
    "\tmax-width: 600px !important;\n" +
    "}\t\n" +
    "td.artsgruppe {\n" +
    "\tfont-size: 90%;\n" +
    "\tpadding: 0px;\n" +
    "}\n" +
    "\n" +
    "td.info-head {\n" +
    "\tfont-size: 80%;\n" +
    "\tpadding-right: 7px;\n" +
    "}\n" +
    "td.info-content {\n" +
    "\twhite-space: nowrap;\n" +
    "}\n" +
    "b.dk {\n" +
    "\tfont-weight: normal;\n" +
    "\ttext-transform: lowercase;\n" +
    "\tcolor: navy;\n" +
    "}</style><script type=text/ng-template id=popover.taxon.html><div class=\"popover\" style=\"width:300px;\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "  <div class=\"popover-content\" ng-model=\"content\">\n" +
    "\t\t<table>\n" +
    "\t\t\t<tr><td class=\"info-content\" colspan=\"2\">Artsgruppe: {{ artInfo.Artsgruppe_dk }}</td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Rige</td><td class=\"info-content\"><em> {{ artInfo.Rige | lowercase }}</em>  <b class=\"dk\">{{ artInfo.Rige_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Række</td><td class=\"info-content\"><em>{{ artInfo.Raekke | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Raekke_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Orden</td><td class=\"info-content\"><em>{{ artInfo.Orden | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Orden_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Klasse</td><td class=\"info-content\"><em>{{ artInfo.Klasse | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Klasse_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Familie</td><td class=\"info-content\"><em>{{ artInfo.Familie | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Familie_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Slægt</td><td class=\"info-content\"><em>{{ artInfo.Slaegt | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Slaegt_dk }}</b></td></tr>\n" +
    "\n" +
    "\t\t</table>\n" +
    "  </div>\n" +
    "</div></script><br><table class=\"table table-condensed\"><thead><tr><th></th><th>Navn</th><th>Dansk navn</th><th></th></tr></thead><tbody><tr class=success><td><button type=button class=\"btn btn-primary\" title=\"Tilføj art til basisliste\" ng-click=taxonCreate()><i class=\"fa fa-plus\"></i></button></td><td><input allearter-typeahead at-taxon=taxon ng-model=taxon.Videnskabeligt_navn class=form-control></td><td><input allearter-typeahead=dk at-taxon=taxon ng-model=taxon.Dansk_navn class=form-control id=new-taxon></td><td><button type=button class=\"btn btn-primary current-taxon\" bs-popover data-trigger=hover data-html=true data-template-url=popover.taxon.html><i class=\"fa fa-info\"></i></button></td></tr></tbody><tbody ng-repeat=\"(artsgruppe, arter) in taxons\"><tr class=active><td colspan=4 class=artsgruppe>{{ artsgruppe }}</td></tr><tr ng-repeat=\"(index, art) in taxons[artsgruppe]\"><td class=check-col><input type=checkbox ng-model=art.taxon_basisliste title=\"Medtag i basisliste\" ng-click=basislisteToggle(art)></td><td>{{ art.taxon_navn }}</td><td>{{ art.taxon_navn_dk }}</td><td style=text-align:right><button type=button class=\"btn btn-primary btn-xs\">&nbsp;<i class=\"fa fa-info\"></i>&nbsp;</button></td></tr></tbody></table>"
  );


  $templateCache.put('app/alert/alert.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-alert><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ alertParams.title }}</h4></div><div class=modal-body><i class=\"fa fa-warning\" style=font-size:300%></i> <span class=text ng-bind-html=alertParams.message></span></div><div class=modal-footer><button type=button class=\"btn btn-success\" ng-click=alertModalClose(true)>Fortsæt</button> <button type=button class=\"btn btn-default\" ng-click=alertModalClose(false)>Fortryd</button></div></div></div></div>"
  );


  $templateCache.put('app/brugerkonto/brugerkonto.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/createuser/createuser.html',
    "<div class=container><h2>Opret bruger</h2><form class=\"form-horizontal col-sm-6\"><div class=form-group><label for=email class=\"col-sm-2 control-label\">Email</label><div class=col-sm-10><input type=email class=form-control id=email placeholder=Email></div></div><div class=form-group><label for=username class=\"col-sm-2 control-label\">Brugernavn</label><div class=col-sm-10><input class=form-control id=username placeholder=brugernavn></div></div><div class=form-group><div class=\"col-sm-offset-2 col-sm-10\"><button type=submit class=\"btn btn-default\">Send anmodning</button></div></div></form></div>"
  );


  $templateCache.put('app/forsoeg/forsoeg.html',
    "<div class=container><h2>Oversigt over forsøg</h2></div>"
  );


  $templateCache.put('app/forsoegModal/forsoegModal.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=forsoeg-modal><div class=modal-dialog><div class=modal-content><div class=modal-header><button type=button class=close ng-click=$hide()>×</button><h4 class=modal-title>Opret nyt forsøg</h4></div><div class=modal-body><div class=form-group></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=kommentarModalCancel()>Fortryd</button> <button type=button class=\"btn btn-success\" ng-click=kommentarModalOk()>Ok</button></div></div></div></div></div>"
  );


  $templateCache.put('app/main/main.html',
    "<br><div class=container><div class=col-sm-12><div class=\"col-md-9 no-float\" style=\"min-height:100% !important;height:100%;font-size:18px\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<h3>Billeder, tekst, links etc</h3></div><div class=\"col-md-3 no-float\" style=\"border-bottom:1px solid #dadada\"><h4>Allerede <b>myrejæger</b>?</h4><div class=form-group><input ng-model=login.brugernavn class=\"form-control input-sm bold xno-padding\" placeholder=\"Brugernavn\"> <input type=password ng-model=login.password class=\"form-control input-sm bold xno-padding\" placeholder=Password style=\"margin-top:7px\"> <button class=\"btn btn-xs\" style=float:left;margin-top:4px>Login</button><div class=checkbox style=float:right;margin-top:1px><label><span style=padding-right:30px>Husk mig</span> <input type=checkbox></label></div></div></div><div class=\"col-md-3 no-float\" style=clear:none;float:right><h4>Tilmeld dig Myrejagten</h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div><h2>Myrejagten forside</h2><ul><li>baggrund</li><li>kort, oversigt over undersøgte steder</li><li>seneste fund mv</li></ul></div>"
  );


  $templateCache.put('app/mypage/mypage.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/proeveNr/proeveNr.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-proeveNr><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ proeveNrModal.title }}</h4></div><div class=modal-body><label class=\"control-label normal\" for=input>{{ proeveNrModal.message }}</label><div class=\"form-group has-success has-feedback\" id=modal-proeveNr-input><input class=\"form-control bold\" ng-model=proeveNrModal.proeve_nr id=input aria-describedby=inputStatus> <span class=\"glyphicon glyphicon-ok form-control-feedback\" id=modal-proeveNr-glyph aria-hidden=true></span> <span id=inputStatus class=sr-only>(warning)</span></div><span class=text-danger id=modal-proeveNr-exists style=display:none>prøveNr <b>{{ proeveNrModal.proeve_nr }}</b> er optaget!</span> <span class=checkbox id=modal-proeveNr-create style=display:none;margin-top:1px><label class=normal style=padding-left:0px;font-size:85%><input type=checkbox ng-model=\"proeveNrModal.willCreate\"> Opret prøve med Prøvenr. <b>{{ proeveNrModal.proeve_nr }}</b></label></span></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=proeveNrClose(false)>Fortryd</button> <button type=button class=\"btn btn-success\" ng-disabled=!proeveNrModal.canSubmit ng-click=proeveNrClose(true)>OK</button></div></div></div></div>"
  );


  $templateCache.put('app/projekt/projekt.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/sagsNo/sagsNo.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-sagsNo><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ sagsNoModal.title }}</h4></div><div class=modal-body><label class=\"control-label normal\" for=input>{{ sagsNoModal.message }}</label><div class=\"form-group has-success has-feedback\" id=modal-sagsNo-input><input class=\"form-control bold\" ng-model=sagsNoModal.sagsNo id=input aria-describedby=inputStatus> <span class=\"glyphicon glyphicon-ok form-control-feedback\" id=modal-sagsNo-glyph aria-hidden=true></span> <span id=inputStatus class=sr-only>(warning)</span></div><span class=text-danger id=modal-sagsNo-exists style=display:none>sagsNr <b>{{ sagsNoModal.sagsNo }}</b> er optaget!</span> <span class=checkbox id=modal-sagsNo-create style=display:none;margin-top:1px><label class=normal style=padding-left:0px;font-size:85%><input type=checkbox ng-model=\"sagsNoModal.willCreate\"> Opret prøve med Prøvenr. <b>{{ sagsNoModal.sagsNo }}</b></label></span></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=sagsNoClose(false)>Fortryd</button> <button type=button class=\"btn btn-success\" ng-disabled=!sagsNoModal.canSubmit ng-click=sagsNoClose(true)>OK</button></div></div></div></div>"
  );


  $templateCache.put('app/tilmeld/tilmeld.html',
    "<div class=container><h3>Tilmeld dig Myrejagten</h3><div class=col-md-8><p>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</p></div><div class=col-md-6><form class=form-horizontal action=\"\" method=POST><fieldset><div class=control-group><label class=control-label for=username>Brugernavn</label><div class=controls><input id=username name=username placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>Dit navn på myrejagten. Kan indeholde bogstaver, tal og mellemrum.</p></div></div><div class=control-group><label class=control-label for=email>E-mail adresse</label><div class=controls><input type=email id=email name=email placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>En gyldig emailadresse der benyttes som login. Der vil blive sendt en bekræftelsesmail til adressen.</p></div></div><div class=control-group><label class=control-label for=password>Password</label><div class=controls><input type=password id=password name=password placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>Password skal være mindst 3 karakterer lang, men ellers er der ingen regler</p></div></div><div class=control-group><!-- Button --><div class=controls><button class=\"btn btn-success\">Register</button></div></div></fieldset></form></div><div class=col-md-6>aasdasdasdasd</div></div>"
  );


  $templateCache.put('components/footer/footer.html',
    "<footer class=footer><div class=container><p>Myrejagten 0.0.0 | Natural History Museum of Denmark | <a href=https://github.com/davidkonrad/myrejagten/issues>Issues</a></p></div></footer>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<img src=http://cms.ku.dk/grafik/images/topgrafik/faelles.svg style=\"height:87px;width:61px;position:absolute;left:20px;top: 20px\"><div style=\"position:absolute;top:98px;border-top:1px solid maroon;min-width:100%\"></div><div class=\"navbar XXXnavbar-default navbar-static-top navbar-snm\" ng-controller=NavbarCtrl><div class=container-fluid><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button><h1 style=padding-left:125px;color:#252525;padding-top:15px>Myrejagten</h1></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><!--\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-class=\"{ active: isActive('/opret-bruger')}\"><a href=\"/opret-bruger\">Opret bruger</span></a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\" ng-class=\"{ active: isActive('/forsøg')}\"><a href=\"/forsøg\">Forsøg</span></a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\" ng-class=\"{ active: isActive('/mine-forsøg')}\"><a href=\"/mine-forsøg\">Mine forsøg</span></a></li>\n" +
    "      </ul>\n" +
    "\t\t\t--><ul class=\"nav navbar-nav navbar-right\"><li><a href=/forside>Forside</a></li><li><a href=/tilmeld>Tilmeld</a></li><li><a href=/brugerkonto>Min brugerkonto</a></li><li><a href=/mine-eksperimenter>Mine eksperimenter</a></li><li><a href=/forside>Forsøg</a></li><li ng-hide=isLoggedIn() ng-class=\"{active: isActive('/login')}\"><a href=/login>Log af</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Bruger: <strong>{{ getCurrentUser().name }}</strong></p></li><li ng-show=isLoggedIn() ng-class=\"{active: isActive('/logout')}\"><a href=\"\" ng-click=logout()>Log af</a></li></ul></div></div></div>"
  );

}]);


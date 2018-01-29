'use strict';

angular.module('myrejagtenApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
	'ngAnimate',
	'mgcrea.ngStrap', 
	'leaflet-directive',
	'datatables',
	'datatables.buttons',
	'datatables.bootstrap',
	'datatables.select',
	'datatables.options',
	'datatables.fixedheader',
	'angular-inview',
	'ui.checkbox',
	'ngFileUpload',
	'textAngular',
	'textAngularSetup',
	'chart.js',
	'fancyboxplus'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, $logProvider, ChartJsProvider, $compileProvider) {
		L.Icon.Default.imagePath = '../assets/';

		//turn logs off, primarily due to heavy leaflet logging
		$logProvider.debugEnabled(true); //false);

    $routeProvider.otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

		//disable debug data to speed up performance 
		//$compileProvider.debugInfoEnabled(false);

		//
		ChartJsProvider.setOptions({
      colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
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
  })

  .run(function ($rootScope, $location, Login) {
		$rootScope.$on('$routeChangeStart', function (event, next) {
			if (next.authenticate && !Login.isLoggedIn()) {
				$location.path('/');
			}
    });
  });
  


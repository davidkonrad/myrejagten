'use strict';

angular.module('myrejagtenApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
	'ngAnimate',
  'btford.socket-io',
	'mgcrea.ngStrap', 
	'LocalStorageModule',
	'leaflet-directive',
	'datatables',
	'datatables.buttons',
	'datatables.bootstrap',
	'datatables.select',
	'datatables.options',
	'angular-inview',
	'ui.checkbox',
	'ngFileUpload',
	'ngVideo',
	'textAngular',
	'textAngularSetup'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, $logProvider) {

		L.Icon.Default.imagePath = '../assets/';
		// your other Leaflet code

		//turn logs off, primarily due to heavy leaflet logging
		$logProvider.debugEnabled(false);

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
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
  


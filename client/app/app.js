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
	'ngVideo'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
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
			//console.log(event, next)

      //Auth.isLoggedInAsync(function(loggedIn) {
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
				//console.log(next)
        if (next.authenticate && !Login.isLoggedIn()) {
          $location.path('/');
        }

      //});
    });
  });
  
  L.Icon.Default.imagePath = '/sites/all/libraries/leaflet/dist/images';



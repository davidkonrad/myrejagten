'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tilmeld', {
        templateUrl: 'app/tilmeld/tilmeld.html',
        controller: 'TilmeldCtrl'
      })
      .when('/glemt-password', {
        templateUrl: 'app/tilmeld/glemt_password.html',
        controller: 'GlemtPasswordCtrl'
      })
      .when('/betingelser-og-vilkår', {
        templateUrl: 'app/tilmeld/betingelser-og-vilkaar.html',
        controller: 'TilmeldCtrl'
      })
      .when('/bekræft-email/', {
        templateUrl: 'app/tilmeld/confirm.html',
        controller: 'ConfirmCtrl'
      });



  });

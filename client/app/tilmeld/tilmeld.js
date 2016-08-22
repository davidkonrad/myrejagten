'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tilmeld', {
        templateUrl: 'app/tilmeld/tilmeld.html',
        controller: 'TilmeldCtrl'
      });
  });

'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/min-konto', {
        templateUrl: 'app/brugerkonto/brugerkonto.html',
        controller: 'BrugerkontoCtrl'
      });
  });

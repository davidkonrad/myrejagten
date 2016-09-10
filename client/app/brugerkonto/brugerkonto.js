'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/konto', {
        templateUrl: 'app/brugerkonto/brugerkonto.html',
        controller: 'BrugerkontoCtrl',
				authenticate: true
      });
  });

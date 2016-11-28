'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/brugerkonto', {
        templateUrl: 'app/brugerkonto/brugerkonto.html',
        controller: 'BrugerkontoCtrl',
				authenticate: true
      });
  });

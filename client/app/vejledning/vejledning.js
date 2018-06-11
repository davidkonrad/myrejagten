'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/vejledning', {
        templateUrl: 'app/vejledning/vejledning.html',
        controller: 'VejledningCtrl'
      });
  });

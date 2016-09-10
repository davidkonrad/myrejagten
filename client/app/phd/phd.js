'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/phd', {
        templateUrl: 'app/phd/phd.html',
        controller: 'PhdCtrl'
      });
  });

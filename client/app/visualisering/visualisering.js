'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/resultater', {
        templateUrl: 'app/visualisering/visualisering.html',
        controller: 'VisualiseringCtrl'
      });
  });

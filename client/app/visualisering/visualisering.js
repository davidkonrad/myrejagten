'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/data-visualisering', {
        templateUrl: 'app/visualisering/visualisering.html',
        controller: 'VisualiseringCtrl'
      });
  });

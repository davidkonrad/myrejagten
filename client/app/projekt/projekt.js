'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mine-eksperimenter', {
        templateUrl: 'app/projekt/projekt.html',
        controller: 'ProjektCtrl',
				authenticate: true
      });
  });

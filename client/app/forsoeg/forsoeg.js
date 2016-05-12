'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/forsøg', {
        templateUrl: 'app/forsoeg/forsoeg.html',
        controller: 'ForsoegCtrl'
      });
  });

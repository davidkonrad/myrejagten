'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/opret-bruger', {
        templateUrl: 'app/createuser/createuser.html',
        controller: 'CreateUserCtrl'
      });
  });

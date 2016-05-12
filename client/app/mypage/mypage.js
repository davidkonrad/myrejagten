'use strict';

angular.module('myrejagtenApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mine-forsøg', {
        templateUrl: 'app/mypage/mypage.html',
        controller: 'MyPageCtrl'
      });
  });

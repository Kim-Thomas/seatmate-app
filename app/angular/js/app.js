/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

/**
 * GLOBAL
 */
var API_URL = 'http://api.seatmate.io';

var socket = io.connect('http://server.seatmate.io');            

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
    'ngCookies',
    'ui.router',
    'appControllers',
    'appDirectives',
    'appServices'
]);

socket.on('newMate', function (user) {
    console.log(user);
});

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);

myApp.run(['$rootScope', '$cookies', 'UserService', function($rootScope, $cookies, UserService) {
      if (typeof $cookies.token != 'undefined') {
          UserService.checkToken($cookies.token).then(function (user) {
              socket.emit('login', user);
              $rootScope.user = user;
          }, function () {
              delete $cookies.token;
          });
      }
}]);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.interceptors.push('TokenInterceptor');
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'templates/views/index.tpl.html',
            controller: 'IndexCtrl'
        })
        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/views/sign-in.tpl.html',
            controller: 'SignInCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'templates/views/about.tpl.html'
        })
        .state('signup', {
            url: '/sign-up',
            templateUrl: 'templates/views/sign-up.tpl.html',
            controller: 'SignUpCtrl'
        })
        .state('logout', {
            url: '/logout',
            controller: function($rootScope, $scope, $state, $cookies) {
                delete $cookies.token;
                delete $rootScope.user;
                $state.go('index');
            }
        })
        .state('error', {
            url: '/error',
            templateUrl: 'templates/views/error.tpl.html'
        });
    $urlRouterProvider.otherwise('/error');
}]);

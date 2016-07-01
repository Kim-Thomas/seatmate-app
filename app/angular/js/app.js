/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

/**
 * GLOBAL
 */
var online = false;  
if (online) {
    var API_URL = 'http://api.seatmate.io';
    if (typeof io != 'undefined') var socket = io.connect('http://server.seatmate.io');
}    
else {
    var API_URL = 'http://localhost:808/seatmate-app/api/public';
    if (typeof io != 'undefined') var socket = io.connect('http://localhost:1337');
}      

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
    'ngCookies',
    'ui.router',
    'appControllers',
    'appDirectives',
    'appServices'
]);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);

myApp.run(['$rootScope', '$cookies', 'UserService', 'AuthService', '$compile', function($rootScope, $cookies, UserService, AuthService, $compile) {
    if (typeof $cookies.token != 'undefined') {
          UserService.checkToken($cookies.token).then(function (user) {
              $rootScope.user = user;
              $rootScope.$broadcast('USER_LOGGED');
          }, function () {
              delete $cookies.token;
          });
    }
}]);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'templates/views/index.tpl.html',
            controller: 'IndexCtrl'
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
        .state('chat', {
            url: '/chat/:id',
            templateUrl: 'templates/views/chat.tpl.html',
            controller: 'ChatCtrl'
        })
        .state('logout', {
            url: '/logout',
            controller: function($rootScope, $scope, $state, $cookies) {
                delete $cookies.token;
                delete $rootScope.user;
                $rootScope.auth.isLogged = false;
                $state.go('index');
            }
        })
        .state('error', {
            url: '/error',
            templateUrl: 'templates/views/error.tpl.html'
        });
    $urlRouterProvider.otherwise('/error');
}]);

myApp.filter('html', function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    };
});
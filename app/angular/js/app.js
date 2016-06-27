/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

/**
 * GLOBAL
 */
var API_URL = 'http://localhost:808';

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

myApp.run(['$rootScope', function($rootScope) {
      
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
            controller: function($scope, $state) {
                $state.go('index');
            }
        })
        .state('error', {
            url: '/error',
            templateUrl: 'templates/views/error.tpl.html'
        });
    $urlRouterProvider.otherwise('/error');
}]);

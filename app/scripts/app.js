/**
 * @author Hamzeen. H.
*/
'use strict';

var app = angular.module('nglabs',['ui.router','firebase']);

app
  .controller('LandingController', LandingController)
  .factory('ToastService', ToastService)
  .constant('FIREBASE_URL', 'https://news-for-ang.firebaseio.com/');
//'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'firebase']);

angular
  .module('nglabs')
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("landing");
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'views/landing.html',
        controller  : "LandingController"
      });
});

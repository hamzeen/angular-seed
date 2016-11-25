'use strict';

/**
 * @ngdoc controller
 * @name boilerplate.controller:LandingController
 * @description
 * Controller for Landing Page of angular 1.x boilerplate project.
 *
 * @author Hamzeen. H.
 */
function LandingController($scope, $state, $rootScope, ToastService) {

  console.log('Landing Controller');

  $scope.init = function() {
    console.log('Landing Controller');
  }

  $scope.notify = function(str_case, duration) {
    var msg_suffix = "</i></strong> message from ngToast. a <i>minimalist</i> service " +
                      "to help you <strong>notify users</strong> on your angular app(s).";
    var msg_prefix = "a sample <strong><i>";

    switch (str_case) {
      case 'info':
      case 'warning':
      case 'success':
      case 'error':
        ToastService.show(msg_prefix + str_case + msg_suffix, str_case, duration);
        break;

      default:
        ToastService.show("welcome to <b>ngToast</b> service. " +
        "This <i>minimalist</i> service aims to help you notify users at " +
        "<i>any point-in-time</i> in your angular app. It comes with built-in support for warning, info, success & error messages.",
        "info", true);
        break;
    }

  }
};

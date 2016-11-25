'use strict';

describe('Controller: PostviewCtrl', function () {

  // load the controller's module
  beforeEach(module('angNewsApp'));

  var PostviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostviewCtrl = $controller('PostviewCtrl', {
      $scope: scope
    });
  }));
});

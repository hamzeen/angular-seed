'use strict';

describe('Filter: hostnameFromUrl', function () {

  // load the filter's module
  beforeEach(module('angNewsApp'));

  // initialize a new instance of the filter before each test
  var hostnameFromUrl;
  beforeEach(inject(function ($filter) {
    hostnameFromUrl = $filter('hostnameFromUrl');
  }));

  

});

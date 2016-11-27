var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var JSONReporter = require('jasmine-json-test-reporter');

var reporter = new HtmlScreenshotReporter({
  userCss: '../style/default.css',
  dest: 'reports/result_html',
  filename: 'index.html'
});

exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e_test/first-spec.js'],


  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
    jasmine.getEnv().addReporter(new JSONReporter({
        file: 'reports/test-results.json',
        beautify: true,
        indentationLevel: 4 // used if beautify === true
    }));
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
}


describe('load-script-once', function () {
  var after = require('after');
  var assert = require('assert');
  var load = require('load-script-once');
  var protocol = require('protocol');
  var count = 10;

  /**
   * Utility method to match all scripts with the
   */

  function findScripts (regex) {
    if (typeof regex === 'string') regex = new RegExp(regex);
    var scripts = document.getElementsByTagName('script');
    var matches = [];
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.src.match(regex)) matches.push(script);
    }
    return matches;
  }

  /**
   * Asserts that the scripts were loaded only once.
   */

  function completed (url, done) {
    return function () {
      var scripts = findScripts(url);
      assert(scripts.length === 1);
      done();
    };
  }

  /**
   * Test a given url
   */

  function test (url) {
    return function (done) {
      var finished = after(count, completed(url, done));
      for (var i = 0; i < count; i++) load(url, finished);
    };
  }

  it('should load a script only once',
    test('https://ssl.google-analytics.com/ga.js'));

  it('should support relative paths', test('./stub.js'));

  it('should support protocol relative urls',
    test('//d2dq2ahtl5zl1z.cloudfront.net/segment.js/v1/segment.min.js'));

  it('should load protocol relative options.src', function (done) {
    var url = '//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js';
    var options = { src: url };
    var finished = after(count, completed(url, done));
    for (var i = 0; i < count; i++) load(options, finished);
  });

  it('should load from a complete options.src', function (done) {
    var url = 'http://ajax.googleapis.com/ajax/libs/dojo/1.9.1/dojo/dojo.js';
    var options = { src: url };
    var finished = after(count, completed(url, done));
    for (var i = 0; i < count; i++) load(options, finished);
  });

  it('should load from options.http', function (done) {
    protocol.http();
    var url = 'http://ajax.googleapis.com/ajax/libs/ext-core/3.1.0/ext-core.js';
    var options = { http: url };
    load(options, completed(url, done));
  });

  it('should load from a relative options.http', function (done) {
    protocol.http();
    var url = '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js';
    var options = { http: url };
    load(options, completed(url, done));
  });

  it('should load from options.https', function (done) {
    protocol.https();
    var url = 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.10/webfont.js';
    var options = { https: url };
    load(options, completed(url, done));
  });

  it('should load from a relative options.https', function (done) {
    protocol.https();
    var url = '//ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js';
    var options = { https: url };
    load(options, completed(url, done));
  });

  it('should not reload cache-busted scripts', function (done) {
    var url = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    var finished = after(count, completed(url, done));
    for (var i = 0; i < count; i++) load(cachebusted(url), finished);

    function cachebusted (url) {
      return url + '?' + Math.random() + '#' + Math.random();
    }
  });

  describe('if the script has already been loaded', function(){
    beforeEach(function(done){
      load('./stub.js', done);
    });

    it('should still callback asynchronously', function(done){
      var zalgo = true;
      load('./stub.js', function(){
        assert(!zalgo);
        done();
      });
      zalgo = false;
    });
  });
});

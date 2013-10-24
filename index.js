
var debug = require('debug')('load-script-once');
var find = require('find');
var load = require('load-script');
var memoize = require('memoize-async');
var url = require('url');


/**
 * Memoize our load function
 */

load = memoize(load, canonical);


/**
 * Module exports
 */

module.exports = function (options, callback) {
  callback = callback || function () {};

  var src = typeof options === 'string'
    ? options
    : chooseUrl(options);

  if (!src) throw new Error('Could not parse the options!');
  debug('loading: %s', src);

  var scripts = document.getElementsByTagName('script');
  var canonicalized = canonical(src);
  var exists = find(scripts, function (script) {
    return canonical(script.src) === canonicalized;
  });

  if (exists) {
    debug('exists: %s', src);
    return callback();
  }

  load(src, callback);
};


/**
 * Return a 'canonical' version of the url (no querystring or hash).
 *
 * @param {String}  href
 * @return {String} canonical
 */

function canonical (href) {
  var parsed = url.parse(href);
  var canonical = '';
  if (parsed.protocol) canonical += parsed.protocol;
  canonical += '//';
  if (parsed.hostname) canonical += parsed.hostname;
  if (parsed.pathname) canonical += parsed.pathname;
  return canonical;
}


/**
 * Chooses a url from the options passed in
 *
 * @param {Object} options
 *  @field {String} src    src to load from
 *  @field {String} http   http src to load
 *  @field {String} https  https src to load
 */

function chooseUrl (options) {
  var protocol = document.location.protocol;
  var https = protocol === 'https:' ||
              protocol === 'chrome-extension:';

  var protocolSrc = https
    ? options.https
    : options.http;

  var src = options.src || protocolSrc;

  if (src && src.indexOf('//') === 0) {
    return https
      ? 'https:' + src
      : 'http:' + src;
  }

  return src;
}
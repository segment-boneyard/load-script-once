
# load-script-once

  Loads a script only once, calls back when ready multiple times. Like `segmentio/load-script`, but loads a script once per url, and doesn't load the script again if it is already on the page.

## Installation

  Install with [component(1)](http://component.io):

    $ component install segmentio/load-script-once


### Example

```js
var load = require('load-script-once');

load('//www.google-analytics.com/ga.js');
```

Loads in the Google Analytics library (assuming it isn't already on the page)

```js
var load = require('load-script-once');

load({
  http  : 'http://www.google-analytics.com/ga.js',
  https : 'https://ssl.google-analytics.com/ga.js'
});
```

Loads in the right URL depending on the protocol.


## API

### loadScriptOnce(src || options, callback)
  Load the given script either by passing a `src` string, or
  an `options` object:

    {
        src: '//example.com/lib.js', // same as `src` string
        http: 'http://example.com/lib.js', // `src` to load if the protocol is `http:`
        https: 'https://ssl.example.com/lib.js' // `src` to load if the protocol is `https:`
    }

  You can also pass in a `callback` that will be called when
  the script loads with `err, event`.


## License

  MIT

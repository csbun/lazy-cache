# lazycache

lazy inmemory cache for node, automatic reset cache asynchronously when expired

[![NPM](https://nodei.co/npm/lazycache.png?compact=true)](https://nodei.co/npm/lazycache/)

[![Build Status](https://travis-ci.org/csbun/lazy-cache.svg?branch=master)](https://travis-ci.org/csbun/lazy-cache)
[![Coverage Status](https://coveralls.io/repos/csbun/lazy-cache/badge.svg?branch=master&service=github)](https://coveralls.io/github/csbun/lazy-cache?branch=master)

## Install

```
npm i lazycache --save
```

## Usage

### lazyCache()

Use the factory method to init a cache object:

```javascript
var defaultCacheTime = 300000; // 300000 ms = 5 min
var cache = require('lazyCache')(defaultCacheTime);
```

if `defaultCacheTime < 0`, a `noCache` object will return, which offer the same API but do __NOT__ cache anything.

### cache.get(key)

Get value from cache

- key: cache key

```javascript
cache.set('key', 'my cache value');
```

### cache.set(key, val [, cacheTime] [, reseter])

Set value into cache

- key: cache key
- val: cache value
- cacheTime: cache time (ms)
- reseter: a function which reset the `cache value`

```javascript
var reseter = function (cb) {
    // async
    setTimeout(function () {
        cb(null, 'new value'); // `null` for NO error
    }, 30);
};
cache.set('key', 'initial value', reseter)
```



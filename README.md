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

### Init

Use the factory method to init a cache object:

```javascript
var defaultCacheTime = 300000; // 300000 ms = 5 min
var cache = require('lazyCache')(defaultCacheTime);
```

### cache.get(key)

Get value from cache

- key: cache key

### cache.set(key, val, cacheTime, reseter)

Set value into cache

- key: cache key
- val: cache value
- cacheTime: cache time (ms)
- reseter: generator function (ES2015) which return a fresh cache value



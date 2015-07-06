# lazy-cache

lazy inmemory cache for node, automatic reset cache asynchronously when expired

## install

```
npm i lazyCache
```

## usage

### init

Use the factory method to init a cache object:

```
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



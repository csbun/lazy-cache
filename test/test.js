'use strict';

var assert = require('assert');
var lazyCache = require('../index');

var KEY = 'key';
var VAL = 'val';
var VAL_RESET = 'new-val';
var CACHE_TIME = 30;

describe('lazy-cache', function () {
    describe('#set', function () {
        it('should return cache itself when set a value in cache', function () {
            var cache = lazyCache(CACHE_TIME);
            var cacheSeted = cache.set(KEY, VAL);
            assert.equal(true, cache === cacheSeted);
        });
    });
    describe('#get', function () {
        it('should return `val` when get key from cache, return `undefined` when expired', function (done) {
            var cache = lazyCache(CACHE_TIME).set(KEY, VAL);
            assert.equal(VAL, cache.get(KEY));
            setTimeout(function() {
                assert.equal(undefined, cache.get(KEY));
                done();
            }, CACHE_TIME + 1);
        });
    });
    describe('#reset', function () {
        it('still return `val` if reseter is seted when expired, get `new val` on next time', function (done) {
            var cache = lazyCache(CACHE_TIME)
                            .set(KEY, VAL, CACHE_TIME, function * () {
                                return VAL_RESET;
                            });
            // cache before expired
            assert.equal(VAL, cache.get(KEY));
            setTimeout(function() {
                // cache after expired
                assert.equal(VAL, cache.get(KEY));
                setTimeout(function() {
                    // cache after expired
                    assert.equal(VAL_RESET, cache.get(KEY));
                    done();
                }, 1);
            }, CACHE_TIME + 1);
        });
    });
});
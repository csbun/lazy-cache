'use strict';

var assert = require('assert');
var lazyCache = require('../index');

var KEY = 'key';
var VAL = 'val';
var VAL_RESET = 'new-val';
var CACHE_TIME = 50;

describe('lazycache', function () {
    describe('#set', function () {
        it('should return cache itself when set a value in cache', function () {
            var cache = lazyCache(CACHE_TIME);
            var cacheSeted = cache.set(KEY, VAL);
            assert.equal(true, cache === cacheSeted);
        });
    });

    describe('#get', function () {
        var cache = lazyCache(CACHE_TIME);
        it('should return `' + VAL + '` when get key from cache', function () {
            cache.set(KEY, VAL);
            assert.equal(VAL, cache.get(KEY));
        });
        it('should return `undefined` when expired', function (done) {
            setTimeout(function() {
                assert.equal(undefined, cache.get(KEY));
                done();
            }, CACHE_TIME + 1);
        });
    });

    describe('#reset', function () {
        var cache = lazyCache(CACHE_TIME);
        var resterDelay = 50;
        var rester = function (cb) {
            setTimeout(function () {
                cb(null, VAL_RESET);
            }, resterDelay);
        };
        it('still return `' + VAL + '` if reseter is seted when expired', function (done) {
            cache.set(KEY, VAL, CACHE_TIME, rester);
            // cache before expired
            assert.equal(VAL, cache.get(KEY));
            setTimeout(function() {
                // cache after expired
                assert.equal(VAL, cache.get(KEY));
                done();
            }, CACHE_TIME + 1);
        });
        it('still return `' + VAL + '` if reseting', function (done) {
            setTimeout(function() {
                // cache after expired
                assert.equal(VAL, cache.get(KEY));
                done();
            }, resterDelay - 10);
        });
        it('get `' + VAL_RESET + '` after reset', function (done) {
            setTimeout(function() {
                // cache after expired
                assert.equal(VAL_RESET, cache.get(KEY));
                done();
            }, CACHE_TIME + 1);
        });
    });

    describe('#reset-error', function () {
        var cache = lazyCache(CACHE_TIME);
        var rester = function (cb) {
            cb('error message', VAL_RESET);
        };
        it('still return `' + VAL + '` if reset error', function (done) {
            cache.set(KEY, VAL, rester);
            setTimeout(function() {
                // cache after expired
                assert.equal(VAL, cache.get(KEY));
                setTimeout(function () {
                    assert.equal(VAL, cache.get(KEY));
                    done();
                }, 10);
            }, CACHE_TIME + 1);
        });
    });

    describe('#no-cache', function () {
        it('should return cache itself when set a value in cache', function () {
            var cache = lazyCache(-1);
            var cacheSeted = cache.set(KEY, VAL);
            assert.equal(true, cache === cacheSeted);
        });
        it('should return undefined whenever set anything in cache', function () {
            var cache = lazyCache(-1);
            cache.set(KEY, VAL, CACHE_TIME);
            assert.equal(undefined, cache.get(KEY));
        });
    });

});
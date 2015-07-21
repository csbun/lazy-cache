'use strict';

/**
 * 内存缓存
 * @param {number} defaultCacheTime 缓存时间长度，毫秒，默认 5 分钟
 */
function Cache(defaultCacheTime) {
    // 内存
    this._mem = {};
    // 默认缓存时长，默认 5 分钟
    this._dct = defaultCacheTime || 300000;
}

/**
 * 从缓存中取出
 * @param  {string} key  缓存的 key
 * @return {object}      缓存的 val
 */
Cache.prototype.get = function(key) {
    var cacheObj = this._mem[key];
    var that = this;
    // 找到缓存内容
    if (cacheObj) {
        // 没有过期
        if ((+new Date()) < cacheObj.expires) {
            return cacheObj.val;
        } else if (cacheObj.reseter) {
            // 如果有注册 getter，则异步读取内容并更新回 cache
            process.nextTick(function () {
                if (cacheObj.reseting) {
                    return;
                }
                cacheObj.reseting = true;
                cacheObj.reseter(function (err, val) {
                    cacheObj.reseting = false;
                    if (err) {
                        console.error(err);
                    } else {
                        that.set(key, val, cacheObj.cacheTime, cacheObj.reseter);
                    }
                });
            });
            // 此时仍然返回过期的数据
            return cacheObj.val;
        } else {
            // 过期又没有 getter，删除这个 cache
            delete this._mem[key];
        }
    }
    // 返回 undefined
};

/**
 * 存入内存
 * @param {string}   key       缓存的 key
 * @param {any}      val       缓存的内容
 * @param {number}   cacheTime 缓存时间长度，毫秒
 * @param {function} reseter   过期后重新获取当前 val 的方法
 */
Cache.prototype.set = function(key, val, cacheTime, reseter) {
    var rfn;
    var ct = this._dct;
    if (isFunction(cacheTime)) {
        rfn = cacheTime;
    } else {
        if (isNumber(cacheTime)) {
            ct = cacheTime;
        }
        if (isFunction(reseter)) {
            rfn = reseter;
        }
    }
    this._mem[key] = {
        val: val,
        reseter: rfn,
        cacheTime: ct,
        expires: (+new Date()) + ct
    };
    return this;
};


function isNumber(arg) {
    return typeof arg === 'number';
}

function isFunction(arg) {
    return typeof arg === 'function';
}

/**
 * NoCache 模式，永远不会缓存
 * 提供 Cache 一样的接口 `get` 和 `set`
 */
function NoCache() {
    var that = this;
    this.set = function () {
        return that;
    };
    this.get = function () {};
}


/**
 * cache 工厂
 * @param  {number} defaultCacheTime 缓存时间长度，毫秒，默认 5 分钟
 * @return {Cache}                   内存缓存
 */
module.exports = function (defaultCacheTime) {
    if (defaultCacheTime < 0) {
        // 如果 defaultCacheTime 则为
        return new NoCache();
    } else {
        return new Cache(defaultCacheTime);
    }
};

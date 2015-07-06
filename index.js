'use strict';

var co = require('co');

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
    // 找到缓存内容
    if (cacheObj) {
        // 没有过期
        if ((+new Date()) < cacheObj.expires) {
            return cacheObj.val;
        } else if (cacheObj.reseter) {
            // 如果有注册 getter，则异步读取内容并更新回 cache
            process.nextTick(function () {
                // TODO: reseting 应该区分 key
                if (cacheObj.reseting) {
                    return;
                }
                cacheObj.reseting = true;
                co(cacheObj.reseter).then(function (val) {
                    cacheObj.reseting = false;
                    this.set(key, val, cacheObj.cacheTime, cacheObj.reseter);
                }.bind(this), function (err) {
                    cacheObj.reseting = false;
                    console.error(err);
                });
            }.bind(this));
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
    cacheTime = cacheTime || this._dct;
    this._mem[key] = {
        val: val,
        reseter: reseter,
        cacheTime: cacheTime,
        expires: (+new Date()) + cacheTime
    };
    return this;
};


/**
 * cache 工厂
 * @param  {number} defaultCacheTime 缓存时间长度，毫秒，默认 5 分钟
 * @return {Cache}                   内存缓存
 */
module.exports = function (defaultCacheTime) {
    return new Cache(defaultCacheTime);
};

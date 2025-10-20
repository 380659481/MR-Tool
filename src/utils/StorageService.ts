/**
 * StorageService API：
 *
 * CookieStorage
 * public static setCookie(key: string, value: any, ttl?: number)
 * public static getCookie(key: string): any
 * public static delCookie(key: string): void
 * public static flushCookie(): void
 *
 * LocalStorage
 * public static getLocalStorage(key: string): any
 * public static setLocalStorage(key: string, value: any, expires?: number)
 * public static delLocalStorage(name: string): boolean
 *
 * SessionStorage
 * public static getSessionStorage(key: string): any
 * public static setSessionStorage(key: string, value: any, expires?: number)
 * public static delSessionStorage(name: string): boolean
 */

const cookieStorage: any = {
    cache: [],
    setItem: function (key: string, value: any, ttl: number, domain: string): void {
        let cookieString = key + '=' + value + ';path=/;domain=' + domain;

        // 判断是否设置过期时间
        if (ttl > 0) {
            let date = new Date();
            date.setTime(date.getTime() + ttl * 1000);
            cookieString = cookieString + '; expires=' + date.toUTCString();
        }
        this.cache.push(key);
        document.cookie = cookieString;
    },
    getItem: function (key: string): any {
        let cookies = document.cookie.split('; ');
        let arr = null;
        let i = 0;
        while (i < cookies.length) {
            arr = cookies[i++].split('=');
            if (arr[0] === key) {
                return arr[1];
            }
        }
        return '';
    },
    removeItem: function (key: string): void {
        let date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = key + '=v; expires=' + date.toUTCString();
    },
    clear: function (): void {
        let cache = this.cache;
        let i = 0;
        while (i < cache.length) {
            this.removeItem(cache[i++]);
        }
    },
};

export class StorageService {
    public static cookieStorage: any = cookieStorage;

    public static setCookie(key: string, value: any, expires?: number, domain?: string): void {
        let storage = StorageService.cookieStorage;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        let defaultDomain = document.domain.replace(/.+?\./, '');
        const specialKeys = ['locale', 'cfLatestRecordTimestamp'];
        const specialKeysDomain = document.domain.split('.').slice(-2).join('.');
        const _domain = domain ? domain : specialKeys.includes(key) ? specialKeysDomain : defaultDomain;
        storage.setItem(key, value, expires, _domain);
    }

    public static getCookie(key: string): any {
        let storage = StorageService.cookieStorage;
        let value = storage.getItem(key);
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    public static delCookie(key: string): void {
        let storage = StorageService.cookieStorage;
        storage.removeItem(key);
    }

    // 在页面点击注销的时候调用该API
    public static flushCookie(): void {
        let storage = StorageService.cookieStorage;
        storage.clear();
    }

    public static setParentCookie(key: string, value: string) {
        let cookieStr = key + '=' + encodeURIComponent(value);
        const expiresTime = 2592e6;
        const date = new Date();
        date.setTime(date.getTime() + expiresTime);
        const host = window.location.hostname;
        const RegUrl = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        const domain = RegUrl.test(host) ? host : host.indexOf('.') === -1 ? host : host.substr(host.indexOf('.'));
        cookieStr += ';path=/;domain=' + domain;
        document['cookie'] = cookieStr + ';secure';
    }

    public static removeParentCookie(key: string): void {
        let cookieStr;
        const host = window.location.hostname;
        const RegUrl = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        const domain = RegUrl.test(host) ? host : host.indexOf('.') === -1 ? host : host.substr(host.indexOf('.'));
        cookieStr = key + '=' + ';path=/;domain=' + domain;
        const d = new Date();
        d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
        cookieStr += ';expires=' + d.toUTCString();
        document['cookie'] = cookieStr;
    }

    /**
     * getLocalStorage: retrieves a key from localStorage previously set with setLocalStorage().
     * @param key <string> : localStorage key
     * @return
     *        <string> : value of localStorage key
     *        null : in case of expired key or failure
     */
    public static getLocalStorage(key: string): any {
        if (!window.localStorage) return;
        const expiresItem = localStorage.getItem(key + '_expiresIn');
        const value = localStorage.getItem(key);
        if (expiresItem === undefined || expiresItem === null) return StorageService.JsonParse(value);
        const expiresIn = Number(expiresItem) || 0;
        if (expiresIn < Date.now()) {
            StorageService.delLocalStorage(key);
            return null;
        } else return StorageService.JsonParse(value);
    }

    public static JsonParse(value: string): any {
        try {
            const res = JSON.parse(value);
            return res;
        } catch (error) {
            return value;
        }
    }

    public static endsWith(str: string, suffix: string) {
        if (typeof str !== 'string' || typeof suffix !== 'string' || str === '' || suffix === '') return false;
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    // 清除过期的cache
    public static clearExpiredStorage(): void {
        Object.keys(localStorage).forEach((item) => {
            if (StorageService.endsWith(item, '_expiresIn')) {
                const expireTime = localStorage.getItem(item);
                if (!expireTime || !Number(expireTime) || Number(expireTime) < Date.now()) {
                    StorageService.delLocalStorage(item.replace('_expiresIn', ''));
                }
            }
        });
    }

    /**
     * setLocalStorage: writes a key into localStorage setting a expire time
     * @param key localStorage key
     * @param value localStorage value
     * @param expires number of seconds from now to expire the key
     * @return <boolean> : telling if operation succeeded
     */
    public static setLocalStorage(key: string, value: any, expires?: number): any {
        if (!localStorage) return;
        StorageService.clearExpiredStorage();
        let expireSecs: number;
        if (expires === undefined || expires === null) {
            expireSecs = 24 * 60 * 60; // default: seconds for 1 day
        } else {
            expireSecs = Math.abs(expires); // make sure it's positive
        }
        let schedule = Date.now() + expireSecs * 1000;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            localStorage.setItem(key + '_expiresIn', schedule.toString());
        } catch (e) {
            // localstorage容量不够，根据保存的时间删除最早的
            if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
                let item: string;
                let tempScripts = [];
                // 先把所有的缓存对象来出来，放到 tempScripts里
                for (item in localStorage) {
                    if (item.indexOf(key) === 0) {
                        tempScripts.push(JSON.parse(localStorage[item]));
                    }
                }
                // 如果有缓存对象
                if (tempScripts.length) {
                    // 按缓存时间升序排列数组
                    tempScripts.sort((a, b) => a.stamp - b.stamp);
                    // 删除缓存时间最早的js
                    StorageService.delLocalStorage(tempScripts[0].key);
                    // 删除后在再添加，利用递归完成
                    return StorageService.setLocalStorage(key, value, expireSecs);
                } else {
                    // 已经没有可以删除的缓存对象了，证明这个将要缓存的目标太大了。返回undefined。
                    return;
                }
            } else {
                // 其他的错误，例如JSON的解析错误
                return;
            }
        }
        return true;
    }

    /*
     * delLocalStorage: removes a key from localStorage and its sibling expiracy key
     * params: key <string>     : localStorage key to remove
     * returns: <boolean> : telling if operation succeeded
     */
    public static delLocalStorage(name: string): boolean {
        try {
            localStorage.removeItem(name);
            localStorage.removeItem(name + '_expiresIn');
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * getSessionStorage: retrieves a key from sessionStorage previously set with setSessionStorage().
     * @param key <string> : sessionStorage key
     * @return
     *        <string> : value of sessionStorage key
     *        null : in case of expired key or failure
     */
    public static getSessionStorage(key: string): any {
        if (!window.sessionStorage) return;
        try {
            let value = sessionStorage.getItem(key);
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }

    /**
     * setSessionStorage: writes a key into sessionStorage
     * @param key sessionStorage key
     * @param value sessionStorage value
     * @return <boolean> : telling if operation succeeded
     */
    public static setSessionStorage(key: string, value: any): boolean {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            return false;
        }
        return true;
    }

    /*
     * delSessionStorage: removes a key from sessionStorage and its sibling expiracy key
     * params: key <string>     : sessionStorage key to remove
     * returns: <boolean> : telling if operation succeeded
     */
    public static delSessionStorage(name: string): boolean {
        try {
            sessionStorage.removeItem(name);
        } catch (e) {
            return false;
        }
        return true;
    }
}

export class CommonUtil {
    public static i18nSubRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;

    // 线下服务catalogOrder
    public static OFFLINE_SERVICE_CATALOG_ORDER = '10001';
    /**
     * 替换字符串{}中的值
     *
     * @param s 待替换字符串
     * @param o 被替换的值
     *
     * @return 替换后的字符串
     *
     * 例：
     * s: 'test/{abc}/ddd'
     * o: {
     *     abc: '123'
     * }
     * return 'test/123/ddd
     */
    static i18nReplace(s: any, o: any): any {
        return s.replace
            ? s.replace(this.i18nSubRegRex, function (match: any, key: string | number) {
                return ['Number', 'String', 'Boolean'].includes(CommonUtil.getTypeOfData(o[key])) ? o[key] : match;
            })
            : s;
    }

    /**
     * 获取数据类型
     * @param data
     */
    public static getTypeOfData(data: any) {
        let res = Object.prototype.toString.call(data);
        return res.substr(0, res.length - 1).split(' ')[1];
    }

    /**
     * @param styles less样式
     * @return 返回获取样式的function
     */
    public static getClass(styles: any): Function {
        return function (className: string) {
            return className
                .split(' ')
                .filter((row: string) => !!row)
                .map((row: string) => `${styles[row]}`)
                .join(' ');
        };
    }

    public static replaceUrlHostName(href, hostname) {
        if (!href || !hostname) {
            return href;
        }

        const reg = /^https:\/\/([a-zA-Z0-9.\-\[\]:]+)\//;
        return href.replace(reg, hostname);
    };

    static getArray(obj) {
        let result = [];
        if (!obj || !this.isObject(obj)) {
            return null;
        }
        for (const key in obj) {
            result.push(obj[key]);
        }
        return result;
    };

    static isObject(o) {
        return Object.prototype.toString.call(o) == '[object Object]';
    }

    static isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    };

    static getValue(key, array) {
        if (!array || !this.isArray(array)) {
            return null;
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i].itemName === key) {
                return array[i].itemValue;
            }
        }
        return null;
    };
}

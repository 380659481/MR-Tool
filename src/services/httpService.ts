import axios, {AxiosResponse} from 'axios';
import {HttpConfig} from './interface/HttpConfig';
import {CommonUtil} from '@utils/commonUtil';
import {StorageService} from '@utils/StorageService';

const instance = axios.create({
    timeout: 10000,
});

instance.defaults.headers.post['Context-Type'] = 'application/json';

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
    (config) => {
        const cftk = StorageService.getCookie('prod_cftk');
        config.headers['Cftk'] = cftk;
        config.headers['x-requested-with'] = 'XMLHttpRequest';
        return config;
    },
    (error) => {
        return Promise.resolve(error);
    },
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
    (response) => {
        const status = response.status;
        if ((status >= 200 && status <= 300) || status === 304) {
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response.data.message);
        }
    },
    (error) => {
        return Promise.reject(error);
    },
);

function formatUri(config: HttpConfig) {
    let url: string =
        Object.prototype.toString.call(config.url) === '[object Object]'
            ? CommonUtil.i18nReplace(config.url['s'], config.url['o'])
            : config.url;
    return url;
}

export class HttpService {
    public static get(config: HttpConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            instance({
                method: 'get',
                url: formatUri(config),
                params: config.params,
                headers: config.headers
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static post(config: HttpConfig): Promise<any> {
        return new Promise(((resolve, reject) => {
            instance({
                method: 'post',
                url: formatUri(config),
                data: config.data,
                headers: config.headers
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        }))
    }

    public static delete(config: HttpConfig): Promise<any> {
        return new Promise(((resolve, reject) => {
            instance({
                method: 'delete',
                url: formatUri(config),
                data: config.data,
                headers: config.headers
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        }))
    }

    public static put(config: HttpConfig): Promise<any> {
        return new Promise(((resolve, reject) => {
            instance({
                method: 'put',
                url: formatUri(config),
                data: config.data,
                headers: config.headers
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        }))
    }
}

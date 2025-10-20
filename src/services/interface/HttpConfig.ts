import {AxiosRequestConfig} from 'axios';

export interface HttpConfig extends AxiosRequestConfig {
  url: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  timeout?: number;
  params?: any;
}

import {HttpConfig} from '../interface/HttpConfig';
import {HttpService} from '../httpService';

export class UserService {
  public static getLoginUserRequest(): Promise<any> {
    const requestConfig: HttpConfig = {
      url: `/codehub/v1/user?_=${Date.now()}`,
      timeout: 60000,
    };

    return HttpService.get(requestConfig);
  }
}

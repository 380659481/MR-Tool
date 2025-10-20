import { HttpService } from "../httpService";
import { HttpConfig } from "../interface/HttpConfig";

export class ProjectService {
  public static getProjectDetail(name: string): Promise<any> {
    let projectPath = encodeURI(`it-manageone/ITPL-ManageOne_ALL/${name}`);
    const requestConfig: HttpConfig = {
      url: `/codehub/v1/resource/detail?path=${projectPath}&_=${Date.now()}`,
      timeout: 60000,
    };

    return HttpService.get(requestConfig);
  }

  public static getMergeRequests(projectId: string): Promise<any> {
    const requestConfig: HttpConfig = {
      url: `/codehub/v1/projects/${projectId}/isource/merge_requests`,
      params: {
        state: "opened",
        order_by: "created_at",
        sort: "asc",
        is_need_mergeable_state: true,
        get_from_es: true,
        view: "basic",
      },
      timeout: 60000,
    };
    return HttpService.get(requestConfig);
  }
}

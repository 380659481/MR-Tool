import { HttpService } from "@services/httpService";
import { HttpConfig } from "@services/interface/HttpConfig";

export class MrService {
  public static getMrMergeableState(projectId: string, mrId: string): Promise<any> {
    const requestConfig: HttpConfig = {
      url: `/codehub/v1/projects/${projectId}/merge_requests/${mrId}/mergeable_state`,
      timeout: 60000,
    };

    return HttpService.get(requestConfig);
  }
}
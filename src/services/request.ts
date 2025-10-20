import {MrUtils} from '@utils/mrUtils';
import {ProjectService} from './request/projectService';
import {UserService} from './request/userService';
import {myMrTypes, otherMrTypes} from '@utils/type';
import {MrService} from './request/mrService';

export function getUserData(): Promise<any> {
    return UserService.getLoginUserRequest();
}

export async function getProjectDetail(name: string): Promise<any> {
    let projectDetail = await ProjectService.getProjectDetail(name);
    return projectDetail?.id;
}

async function getMrDetail(projectId: string, mrId: string): Promise<any> {
    const mrMergeableState = MrService.getMrMergeableState(projectId, mrId);
    return {};
}

export async function getMrRequestList(user: any, projectId: string): Promise<any> {
    let merge_requests = await ProjectService.getMergeRequests(projectId);
    const sortedMrs = merge_requests
        .flat()
        .sort(
            (mr1, mr2) =>
                new Date(mr1.created_at).getTime() - new Date(mr2.created_at).getTime(),
        );
    
    const mrs = await Promise.all(sortedMrs.map(async mr => {
        let mrInfo = {
            user: user,
            mrDetail: mr,
        };
        let myMr = MrUtils.isMyMr(mrInfo);
        console.log('myMr is: ', myMr);
        const mrTypes = myMr ? myMrTypes : otherMrTypes;

        const mrType = mrTypes
            .filter(({isActivated}) => isActivated !== false)
            .find(({test}) => test(mrInfo));
        MrUtils.setMrStyle(mr, mrType.style);
        return mr;
    }));

    return mrs;
}

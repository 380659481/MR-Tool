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

export async function getMrRequestListFromMultipleServices(user: any, serviceNames: string[]): Promise<any> {
    console.log('Loading MRs from multiple services:', serviceNames);
    
    // 并行获取所有服务的项目ID
    const projectIdPromises = serviceNames.map(serviceName => 
        getProjectDetail(serviceName).catch(error => {
            console.error(`Failed to get project detail for ${serviceName}:`, error);
            return null;
        })
    );
    
    const projectIds = await Promise.all(projectIdPromises);
    
    // 过滤掉获取失败的项目ID
    const validProjectData = serviceNames
        .map((serviceName, index) => ({
            serviceName,
            projectId: projectIds[index]
        }))
        .filter(item => item.projectId !== null);
    
    console.log('Valid project IDs:', validProjectData);
    
    // 并行获取所有有效项目的MR
    const mrPromises = validProjectData.map(async ({ serviceName, projectId }) => {
        try {
            const mrs = await getMrRequestList(user, projectId);
            // 为每个MR添加服务名称信息
            return mrs.map(mr => ({
                ...mr,
                serviceName: serviceName
            }));
        } catch (error) {
            console.error(`Failed to get MRs for service ${serviceName}:`, error);
            return [];
        }
    });
    
    const allMrArrays = await Promise.all(mrPromises);
    
    // 合并所有MR并按创建时间排序
    const allMrs = allMrArrays
        .flat()
        .sort((mr1, mr2) => 
            new Date(mr1.created_at).getTime() - new Date(mr2.created_at).getTime()
        );
    
    console.log(`Loaded ${allMrs.length} MRs from ${validProjectData.length} services`);
    return allMrs;
}

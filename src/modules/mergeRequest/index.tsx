import {useEffect, useState} from 'react';
import styles from './index.less';
import {getMrRequestList, getMrRequestListFromMultipleServices, getProjectDetail, MergeRequest as MRInterface} from '@services/request';
import {connect} from 'react-redux';
import {IService} from '@store/service';

interface Props {
    user: any;
    service: IService | string;  // Support both new and legacy service state
}

function MergeRequest({user, service}: Props) {
    const [mrList, setMrList] = useState<MRInterface[]>([]);
    const [loading, setLoading] = useState(false);
    
    const getMrRequest = async (name: string) => {
        if (!name) {
            return;
        }
        setLoading(true);
        try {
            let projectId = await getProjectDetail(name);
            let res = await getMrRequestList(user, projectId);
            if (res.length > 0) {
                setMrList(res);
            } else {
                setMrList([]);
            }
        } catch (error) {
            console.error('Error loading MRs for single service:', error);
            setMrList([]);
        } finally {
            setLoading(false);
        }
    };

    const getMrRequestsFromAllServices = async (serviceNames: string[]) => {
        if (!serviceNames || serviceNames.length === 0) {
            return;
        }
        setLoading(true);
        try {
            const res = await getMrRequestListFromMultipleServices(user, serviceNames);
            setMrList(res);
        } catch (error) {
            console.error('Error loading MRs from multiple services:', error);
            setMrList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Service state changed:', service);
        
        if (!service || !user) {
            return;
        }

        if (service.loadAll && service.selectedServices && service.selectedServices.length > 0) {
            // 加载所有服务的MR
            getMrRequestsFromAllServices(service.selectedServices);
        } else if (!service.loadAll && service.selectedServices && service.selectedServices.length > 0) {
            // 加载单个服务的MR
            getMrRequest(service.selectedServices[0]);
        } else if (typeof service === 'string') {
            // 向后兼容：如果service仍然是字符串格式
            getMrRequest(service);
        }
    }, [service, user]);

    return (
        <div>
            {loading && <div style={{padding: '10px', textAlign: 'center'}}>正在加载MR...</div>}
            <table className={styles.mrTable}>
                <thead>
                    <tr>
                        <th>项目</th>
                        <th>标题</th>
                        <th>作者</th>
                        <th>创建时间</th>
                        <th>目标分支</th>
                        {service?.loadAll && <th>服务名称</th>}
                    </tr>
                </thead>
                <tbody>
                    {mrList?.map((item: MRInterface, index: number) => {
                        // Use a more unique key to avoid React rendering issues
                        const uniqueKey = item.serviceName ? `${item.serviceName}-${item.id}` : `${item.id}-${index}`;
                        return (
                            <tr key={uniqueKey}>
                                <td>{item?.source_project?.name}</td>
                                <td style={{ color: item.styleColor || 'black' }}>
                                    {item.styleTags && item.styleTags.length > 0 && (
                                        <span className={styles.mrStatusTags}>
                                            {item.styleTags.map(tag => `【${tag}】`).join('')}
                                        </span>
                                    )}
                                    {item?.title}
                                </td>
                                <td>{item?.author?.name_cn}</td>
                                <td>{new Date(item.created_at).toLocaleString()}</td>
                                <td>{item?.target_branch}</td>
                                {service?.loadAll && <td>{item?.serviceName}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {!loading && mrList.length === 0 && (
                <div style={{padding: '10px', textAlign: 'center', color: '#666'}}>
                    没有找到待检视的MR
                </div>
            )}
        </div>
    );
}

export default connect(({user, service}: any) => ({user, service}))(MergeRequest);

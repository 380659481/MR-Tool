import {useEffect, useState} from 'react';
import styles from './index.less';
import {getMrRequestList, getProjectDetail} from '@services/request';
import {connect} from 'react-redux';

interface Props {
    user: any;
    service: any;
}

function MergeRequest({user, service}: Props) {
    const [mrList, setMrList] = useState([]);
    const getMrRequest = async (name: string) => {
        if (!name) {
            return;
        }
        let projectId = await getProjectDetail(name);
        let res = await getMrRequestList(user, projectId);
        if (res.length > 0) {
            setMrList(res);
        }
    };

    useEffect(() => {
        console.log(service);
        getMrRequest(service);
    }, [service]);

    return (
        <table className={styles.mrTable}>
            {mrList?.map((item: any) => {
                return (
                    <tr>
                        <td>{item?.source_project.name}</td>
                        <td>{item?.title}</td>
                        <td>{item?.author?.name_cn}</td>
                        <td>{new Date(item.created_at).toLocaleString()}</td>
                        <td>{item?.target_branch}</td>
                    </tr>
                );
            })}
        </table>
    );
}

export default connect(({user, service}: any) => ({user, service}))(MergeRequest);

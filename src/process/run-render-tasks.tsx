import MRComponent from '@modules/mrComponent';
import '../index.less';
import ReactDOM from 'react-dom';
import { getUserData } from '@services/request';
import store from '@store/store';

function initData() {
    getUserData().then((data: any) => {
        store.dispatch({type: 'UPDATE_USER_ALL', payload: data});
    });
}

function renderTask(Component: any) {
    const div = document.createElement('div');
    div.id = 'mo-mr-list';
    document.querySelector('header .header-left').append(div);
    ReactDOM.render(
        <Component />,
        document.getElementById('mo-mr-list') as HTMLElement
    )
}

export function runRenderTask() {
    setTimeout(() => {
        initData();
        renderTask(MRComponent);
    }, 2000);
}
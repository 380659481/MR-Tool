export interface IProject {
  [prop: string]: string;
}

const initState: IProject = {
  id: ""
}

export default {
  namespace: 'project',
  state: initState,
  reducer: (state = initState, {type, payload}: any) => {
    switch (type) {
      case 'UPDATE_PROJECT_DETAIL':
        return {...state, ...payload};
      default:
        return state;
    }
  },
}

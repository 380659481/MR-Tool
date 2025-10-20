export interface IUser {
  [prop: string]: string;
}

const initState: IUser = {
  username: "",
  name: "",
  id: ""
}

export default {
  namespace: 'user',
  state: initState,
  reducer: (state = initState, {type, payload}: any) => {
    switch (type) {
      case 'UPDATE_USER_ALL':
        return {...state, ...payload};
      default:
        return state;
    }
  },
}

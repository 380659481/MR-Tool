export type IService = string;
const initState: IService = "";

export default {
  namespace: "service",
  state: initState,
  reducer: (state = initState, { type, payload }: any) => {
    switch (type) {
      case "UPDATE_SERVICE":
        return payload;
      default:
        return state;
    }
  },
};

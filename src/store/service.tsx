export type IService = {
  selectedServices: string[];
  loadAll: boolean;
};

const initState: IService = {
  selectedServices: [],
  loadAll: false,
};

export default {
  namespace: "service",
  state: initState,
  reducer: (state = initState, { type, payload }: any) => {
    switch (type) {
      case "UPDATE_SERVICE":
        return {
          ...state,
          selectedServices: [payload],
          loadAll: false,
        };
      case "LOAD_ALL_SERVICES":
        return {
          ...state,
          selectedServices: payload,
          loadAll: true,
        };
      default:
        return state;
    }
  },
};

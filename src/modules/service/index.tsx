import { Button, ButtonGroup } from "@material-ui/core";
import store from "@store/store";
import { useEffect, useState } from "react";

function service() {
  const serviceList = [
    "MOServiceAccessWebsite",
    "MOVDCWebsite",
    "MOTenantConsoleHomeWebsite",
    "MOConsoleFrameworkWebsite",
    "MOApprovalWebsite",
    "MOWorkOrderWebsite",
    "MOApprovalService",
    "MOSilvanService",
    "MOConsoleFrameworkService",
    "MOWorkOrderService",
    "MOMeteringService",
    "MOOrderService",
    "MOPortalResource",
    "MOServiceBrokerService",
    "MOProductService",
    "MOResourceLifeCycleService",
    "MOResourceLifeCycleWebsite",
    "MOMuiSDK",
    "MOVDCService",
  ];

  const [currentService, setCurrentService] = useState(serviceList[0]);
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    // 初始化store
    store.dispatch({ type: "UPDATE_SERVICE", payload: serviceList[0] });

    // 订阅store变化
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      // 根据实际store结构调整路径
      if (state.service) {
        setLoadAll(state.service.loadAll);
        if (!state.service.loadAll && state.service.selectedServices.length > 0) {
          setCurrentService(state.service.selectedServices[0]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeService = (service) => {
    console.log(service);
    store.dispatch({ type: "UPDATE_SERVICE", payload: service });
  };

  const loadAllServices = () => {
    console.log("Loading all services");
    store.dispatch({ type: "LOAD_ALL_SERVICES", payload: serviceList });
  };

  return (
    <div>
      <ButtonGroup
        size="small"
        color="primary"
        aria-label="small outlined button group"
        style={{ marginBottom: "8px" }}
      >
        <Button
          onClick={loadAllServices}
          variant={loadAll ? "contained" : "outlined"}
          color="secondary"
        >
          加载所有仓库
        </Button>
      </ButtonGroup>
      <ButtonGroup
        size="small"
        color="primary"
        aria-label="small outlined button group"
      >
        {serviceList.map((item) => (
          <Button
            key={item}
            onClick={() => changeService(item)}
            variant={!loadAll && currentService === item ? "contained" : "outlined"}
            disabled={loadAll}
          >
            {item}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
export default service;

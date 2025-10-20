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

  useEffect(() => {
    // 初始化store
    store.dispatch({ type: "UPDATE_SERVICE", payload: serviceList[0] });

    // 订阅store变化
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      // 根据实际store结构调整路径（假设状态存储在state.service中）
      if (state.service) setCurrentService(state.service);
    });

    return () => unsubscribe();
  }, []);

  const changeService = (service) => {
    console.log(service);
    store.dispatch({ type: "UPDATE_SERVICE", payload: service });
  };

  return (
    <ButtonGroup
      size="small"
      color="primary"
      aria-label="small outlined button group"
    >
      {serviceList.map((item) => (
        <Button
          key={item}
          onClick={() => changeService(item)}
          variant={currentService === item ? "contained" : "outlined"}
        >
          {item}
        </Button>
      ))}
    </ButtonGroup>
  );
}
export default service;

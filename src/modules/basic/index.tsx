import MergeRequest from "@modules/mergeRequest";
import Service from "@modules/service";
import { useState } from "react";
import styles from "./index.less";

function Basic() {
  const [display, setDisplay] = useState(false);

  const handleOpen = () => {
    setDisplay(!display);
  };

  return (
    <div>
      <button className={styles.mrButton} onClick={handleOpen}>
        代码检视
      </button>
      {display ? (
        <div id="mr-list-container" className={styles.mrListContainer}>
          <Service />
          <MergeRequest />
        </div>
      ) : null}
    </div>
  );
}

export default Basic;

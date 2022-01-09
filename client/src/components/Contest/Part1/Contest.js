import React from "react";
import OwnerInformation from "../OwnerInformation/OwnerInformation";
import styles from "./styles";

const Contest = ({ contest }) => {
  return (
    <div>
      <div style={styles.item}>
        <OwnerInformation contest={contest} />
      </div>
    </div>
  );
};

export default Contest;

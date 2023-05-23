import React from "react";
//components
import Path from "./Path/Path";
import TitleContest from "./Title/TitleContest";
// api
import styles from "./styles";

const Contest = ({ contest }) => {
  return (
    <div style={styles.item}>
      <TitleContest contest={contest} />
      <Path contest={contest} />
    </div>
  );
};

export default Contest;

// libs
import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
// components
import { Navbar } from "../../../components";
import QuestionComponent from "./QuestionComponent/QuestionComponent";
import FunctionalButton from "../FunctionalButton/FunctionalButton";
//others
import styles from "../styles";
import "../style.css";
import TitleContest from "../Title/TitleContest";

const { Text } = Typography;
const CreatContestPart2 = () => {
  const [listQuestion, setListQuestion] = useState([
    <QuestionComponent key={0} />,
  ]);

  const handleClick = () => {};
  const handleCreate = () => {};

  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <div style={styles.qsArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <TitleContest part={"Part 2"} />
              {listQuestion.map((component, i) => (
                <React.Fragment key={i}>{component}</React.Fragment>
              ))}
              <FunctionalButton />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatContestPart2;

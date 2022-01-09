// libs
import React, { useState } from "react";
import { Card, Typography, Button, Input } from "antd";
// components
import { Navbar } from "../../../components";
import QuestionComponent from "./QuestionComponent/QuestionComponent";
import TitleContest from "../Title/TitleContest";
import FunctionalButton from "../FunctionalButton/FunctionalButton";
//others
import styles from "../styles";
import "../style.css";

const { Text } = Typography;
const CreatContestPart5 = () => {
  const [listQuestions, setListQuestions] = useState([1,2]);

  const handleAddQuestion = () => { };
  const handleCreate = () => { };

  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <div style={styles.qsArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <TitleContest part={"Part 5"} />
              {listQuestions.map((question, i) => (
                <React.Fragment key={i}>
                  <QuestionComponent questionId={i} />,
                </React.Fragment>
              ))}

              <FunctionalButton />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatContestPart5;

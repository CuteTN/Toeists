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
import { usePatch } from "../../../hooks/usePatch";

const { Text } = Typography;
const CreatContestPart5 = () => {
  const [contest, setContest, patchContest] = usePatch({
    title: "",
    part: 5,
    resource: {
      questions: [{}]
    }
  }) 

  const handleQuestionChange = (id, question) => {
    patchContest(["resource", "questions", id], question);
  }

  const handleAddQuestion = () => { 
    patchContest(["resource", "questions"], prev => [...prev??[], {}])
  };

  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <div style={styles.qsArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <TitleContest part={"Part 5"} onTitleChange={v => patchContest(["title"], v)}/>
              {contest?.resource?.questions.map((question, i) => (
                <React.Fragment key={i}>
                  <QuestionComponent questionId={i} onQuestionChange={handleQuestionChange} />,
                </React.Fragment>
              ))}

              <FunctionalButton 
                onAddContentClick={handleAddQuestion}
                contest={contest}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatContestPart5;

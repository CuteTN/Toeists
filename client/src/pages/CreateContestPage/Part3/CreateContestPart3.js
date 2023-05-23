// libs
import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
// components
import { Navbar } from "../../../components";
import ParagraphComponent from "./QuestionComponent/QuestionComponent";
import FunctionalButton from "../FunctionalButton/FunctionalButton";
//others
import styles from "../styles";
import "../style.css";
import TitleContest from "../Title/TitleContest";
import { usePatch } from "../../../hooks/usePatch";

const { Text } = Typography;

const CreatContestPart3 = () => {
  const [contest, setContest, patchContest] = usePatch({
    title: '',
    part: 3,
    resource: {
      paragraphs: [{}]
    }
  });

  const handleParagraphChange = (paragraphId, paragraph) => {
    patchContest(["resource", "paragraphs", paragraphId], paragraph);
  }

  const handleAddParagraph = () => {
    const newId = contest?.resource?.paragraphs?.length;
    patchContest(["resource", "paragraphs", newId], {});
  }

  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <div style={styles.qsArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <TitleContest part={"Part 3"} onTitleChange={v => patchContest(["title"], v)}/>
              {contest?.resource?.paragraphs?.map((paragraph, i) => (
                <div key={i} hidden={!!paragraph?.isDeleted}>{
                  <ParagraphComponent paragraphId={i} onParagraphChange={handleParagraphChange}/>
                }</div>
              ))}
              <FunctionalButton hasParagraphs contest={contest} onAddContentClick={handleAddParagraph}/>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatContestPart3;

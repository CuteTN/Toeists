// libs
import React from "react";
import { Typography, Image, Button, Input } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = () => {
  const handleAddAudio = () => {};
  const handleAddPicture = () => {};
  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <div className="add-button">
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleAddAudio}
        >
          ADD AUDIO
        </Button>
      </div>
      <div>
        <CorrectAnswerRadio amount={3} />
      </div>
    </div>
  );
};
export default QuestionComponent;

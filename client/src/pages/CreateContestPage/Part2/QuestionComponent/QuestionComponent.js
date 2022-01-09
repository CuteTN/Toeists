// libs
import React from "react";
import { Typography, Image, Button, Input } from "antd";
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
        <p className="title-question">Correct Answer</p>
        <Input
          name="answer1"
          style={{ width: 480 }}
          placeholder="Correct Answer ( A, B or C )"
        />
      </div>
    </div>
  );
};
export default QuestionComponent;

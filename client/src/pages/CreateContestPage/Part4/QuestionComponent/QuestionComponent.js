// libs
import React, { useState } from "react";
import { Typography, Image, Button, Input } from "antd";
//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = () => {
  const handleAddAudio = () => {};
  const handleAddPicture = () => {};

  const Question = () => {
    return (
      <div>
        <p className="title-question">Question</p>
        <Input.TextArea
          name="question"
          placeholder="Question"
          style={{ height: 70 }}
        />
        <div className="answer">
          <Input name="answer1" placeholder="Answer 1" />
          <Input name="answer2" placeholder="Answer 2" />
          <Input name="answer3" placeholder="Answer 3" />
          <Input name="answer4" placeholder="Answer 4" />
          <Input name="answer1" placeholder="Correct Answer" />
        </div>
      </div>
    );
  };
  const [listQuestion, setListQuestion] = useState([<Question key={0} />]);

  const handleClick = () => {};
  return (
    <div className="question-component-wrapper">
      <p className="title-question">Conversations</p>
      <div className="add-button">
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleAddAudio}
        >
          ADD AUDIO
        </Button>
      </div>
      <div className="answer">
        {listQuestion.map((component, i) => (
          <React.Fragment key={i}>{component}</React.Fragment>
        ))}
      </div>
      <Button
        className="orange-button"
        style={{ fontWeight: "bold", margin: 15 }}
        onClick={handleClick}
      >
        ADD A QUESTION
      </Button>
    </div>
  );
};
export default QuestionComponent;

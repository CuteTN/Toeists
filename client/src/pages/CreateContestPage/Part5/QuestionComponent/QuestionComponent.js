// libs
import React from "react";
import { Typography, Input, Form } from "antd";
// components

//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = ({ isPart5 }) => {
  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: isPart5 ? 100 : 400 }}
      />
      <div className="answer">
        <Input name="answer1" placeholder="Correct Answer" />
        <Input name="answer2" placeholder="Answer 2" />
        <Input name="answer3" placeholder="Answer 3" />
        {isPart5 && <Input name="answer4" placeholder="Answer 4" />}
      </div>
    </div>
  );
};
export default QuestionComponent;

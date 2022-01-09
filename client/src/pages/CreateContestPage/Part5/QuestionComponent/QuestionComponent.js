// libs
import React from "react";
import { Typography, Input } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = () => {
  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: 100 }}
      />
      <div className="answer">
        <Input name="answer1" placeholder="Answer 1" />
        <Input name="answer2" placeholder="Answer 2" />
        <Input name="answer3" placeholder="Answer 3" />
        <Input name="answer4" placeholder="Answer 4" />
        <CorrectAnswerRadio amount={4} />
      </div>
    </div>
  );
};
export default QuestionComponent;

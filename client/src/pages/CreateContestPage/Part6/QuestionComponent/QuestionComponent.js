// libs
import React from "react";
import { Typography, Input } from "antd";
// components

//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = () => {
  const qs = ["1.", "2.", "3."];
  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: 300 }}
      />
      <div className="answer">
        {qs.map((item, i) => (
          <div key={i}>
            <p className="number">{item}</p>
            <Input
              className="input-answer"
              name="answer1"
              placeholder="Correct Answer"
            />
            <Input
              className="input-answer"
              name="answer2"
              placeholder="Answer 2"
            />
            <Input
              className="input-answer"
              name="answer3"
              placeholder="Answer 3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default QuestionComponent;

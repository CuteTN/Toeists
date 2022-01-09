// libs
import React, { useEffect } from "react";
import { Typography, Input } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";

const { Text } = Typography;
const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, patchQuestion] = usePatch({
    question: "",
    options: ["","","",""],
    answer: "",
  });

  React.useEffect(() => {
    onQuestionChange?.(questionId, question)
  }, [question])

  const handleInputChange = (e, targetPathList) => {
    const value = e.target.value;
    patchQuestion(targetPathList, value);
  }

  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: 100 }}
        onChange={e => handleInputChange(e, ["question"])}
      />
      <div className="answer">
        <Input name="optionA" placeholder="Option A" onChange={e => handleInputChange(e, ["options", 0])}/>
        <Input name="optionB" placeholder="Option B" onChange={e => handleInputChange(e, ["options", 1])}/>
        <Input name="optionC" placeholder="Option C" onChange={e => handleInputChange(e, ["options", 2])}/>
        <Input name="optionD" placeholder="Option D" onChange={e => handleInputChange(e, ["options", 3])}/>
        <CorrectAnswerRadio amount={4} onChange={v => patchQuestion(["answer"], v)}/>
      </div>
    </div>
  );
};
export default QuestionComponent;

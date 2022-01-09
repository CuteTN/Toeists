// libs
import React, { useEffect } from "react";
import { Typography, Input } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { useSetField } from "../../../../hooks/useSetField";

const { Text } = Typography;
const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, setQuestionField] = useSetField({
    question: "",
    options: ["","","",""],
    answer: "",
  });

  useEffect(() => {
    onQuestionChange?.(questionId, question)
  }, [question])

  const handleInputChange = (e, pathList) => {
    const value = e.target.value;
    setQuestionField(pathList, value);
  }

  return (
    <div className="question-component-wrapper">
      <p className="title-question">Question</p>
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: 100 }}
      />
      <div className="answer">
        <Input name="optionA" placeholder="Option A" onChange={e => handleInputChange(e, ["options", 0])}/>
        <Input name="optionB" placeholder="Option B" onChange={e => handleInputChange(e, ["options", 1])}/>
        <Input name="optionC" placeholder="Option C" onChange={e => handleInputChange(e, ["options", 2])}/>
        <Input name="optionD" placeholder="Option D" onChange={e => handleInputChange(e, ["options", 3])}/>
        <CorrectAnswerRadio amount={4} onChange={v => setQuestionField(["answer"], v)}/>
      </div>
    </div>
  );
};
export default QuestionComponent;

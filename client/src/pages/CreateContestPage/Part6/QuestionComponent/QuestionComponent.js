// libs
import React, { useState } from "react";
import { Typography, Input, Button } from "antd";
// components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";

const { Text } = Typography;

const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, patchQuestion] = usePatch({
    question: "",
    options: ["", "", "", ""],
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
    <div>
      <p className="title-question">Question</p>
      <div className="answer">
        <Input name="optionA" placeholder="Option A" onChange={e => handleInputChange(e, ["options", 0])} />
        <Input name="optionB" placeholder="Option B" onChange={e => handleInputChange(e, ["options", 1])} />
        <Input name="optionC" placeholder="Option C" onChange={e => handleInputChange(e, ["options", 2])} />
        <Input name="optionD" placeholder="Option D" onChange={e => handleInputChange(e, ["options", 3])} />
        <CorrectAnswerRadio amount={4} onChange={v => patchQuestion(["answer"], v)} />
      </div>
    </div>
  );
}


const ParagraphComponent = ({ paragraphId, onParagraphChange }) => {
  const [paragraph, setParagraph, patchParagraph] = usePatch({
    paragraph: '',
    questions: [{}],
  });

  React.useEffect(() => {
    onParagraphChange?.(paragraphId, paragraph)
  }, [paragraph])

  const handleInputChange = (e, targetPathList) => {
    const value = e.target.value;
    patchParagraph(targetPathList, value);
  }

  const handleQuestionChange = (questionId, question) => {
    patchParagraph(["questions", questionId], question);
  }

  const handleAddQuestionClick = () => { 
    patchParagraph(["questions"], prev => [...prev, {}])
  };

  return (
    <div className="question-component-wrapper">
      <p className="title-question">Paragraph</p>
      <Input.TextArea
        name="paragraph"
        placeholder="Paragraph"
        style={{ height: 300 }}
        onChange={e => handleInputChange(e, ['paragraph'])}
      />
      <div className="answer">
        {paragraph?.questions?.map((question, i) => (
          <React.Fragment key={i}>{
            <QuestionComponent questionId={i} onQuestionChange={handleQuestionChange}/>
          }</React.Fragment>
        ))}
      </div>
      <Button
        className="orange-button"
        style={{ fontWeight: "bold", margin: 15 }}
        onClick={handleAddQuestionClick}
      >
        ADD A QUESTION
      </Button>
    </div>
  );
};
export default ParagraphComponent;

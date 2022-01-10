// libs
import React, { useState } from "react";
import { Typography, Input, Button, Row } from "antd";
// components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";

const { Text } = Typography;

const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, patchQuestion] = usePatch({
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

  const handleQuestionRemove = () => {
    patchQuestion(["isDeleted"], true);
  }

  return (
    <div>
      <Row className="d-flex justify-content-between">
        <p className="title-question">Question</p>
        <Button
          style={{ fontWeight: "bold", }}
          className="orange-button"
          onClick={handleQuestionRemove}
        >
          REMOVE QUESTION
        </Button>
      </Row>
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
    const newId = paragraph?.questions?.length;
    patchParagraph(["questions", newId], {});
  };

  const handleParagraphRemove = () => {
    patchParagraph(["isDeleted"], true);
  }

  return (
    <div className="question-component-wrapper">
      <Row className="d-flex justify-content-between">
      <p className="title-question">Paragraph</p>
        <Button
          style={{ fontWeight: "bold", }}
          className="orange-button"
          onClick={handleParagraphRemove}
        >
          REMOVE PARAGRAPH
        </Button>
      </Row>
      <Input.TextArea
        name="paragraph"
        placeholder="Paragraph"
        style={{ height: 300 }}
        onChange={e => handleInputChange(e, ['paragraph'])}
      />
      <div className="answer">
        {paragraph?.questions?.map((question, i) => (
          <div key={i} hidden={!!question?.isDeleted}>{
            <QuestionComponent questionId={i} onQuestionChange={handleQuestionChange} />
          }</div>
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

// libs
import React, { useState } from "react";
import { Typography, Input, Button, Image } from "antd";
// components

//others
import "./style.css";

const { Text } = Typography;
const QuestionComponent = () => {
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
          <Input name="answer1" placeholder="Correct Answer" />
          <Input name="answer2" placeholder="Answer 2" />
          <Input name="answer3" placeholder="Answer 3" />
          <Input name="answer4" placeholder="Answer 4" />
        </div>
      </div>
    );
  };

  const [listQuestion, setListQuestion] = useState([<Question key={0} />]);

  const handleClick = () => {};

  return (
    <div className="question-component-wrapper">
      <p className="title-question">Paragraph</p>
      <div className="paragraph-image">
        <Input.TextArea
          name="question"
          placeholder="Question"
          style={{ height: 300 }}
        />
        <Image
          src="https://shophoavip.com/uploads/noidung/images/shophoavip12/hoa-oai-huong-lavender/lavender.jpg"
          style={{
            maxHeight: "40vh",
            width: "100%",
            objectFit: "revert",
            height: "auto",
            display: "block",
          }}
        ></Image>
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
        ADD QUESTION
      </Button>
    </div>
  );
};
export default QuestionComponent;

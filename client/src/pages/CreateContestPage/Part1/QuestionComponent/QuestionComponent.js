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
      <Image
        src="https://shophoavip.com/uploads/noidung/images/shophoavip12/hoa-oai-huong-lavender/lavender.jpg"
        style={{
          maxHeight: "40vh",
          width: "100%",
          objectFit: "cover",
          height: "auto",
          display: "block",
        }}
      ></Image>
      <div className="add-button">
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleAddAudio}
        >
          ADD AUDIO
        </Button>
        <Button
          className="orange-button"
          style={{ fontWeight: "bold" }}
          onClick={handleAddPicture}
        >
          ADD PICTURE
        </Button>
      </div>
      <div>
        <Input
          name="answer1"
          style={{ width: 480 }}
          placeholder="Correct Answer"
        />
      </div>
    </div>
  );
};
export default QuestionComponent;

// libs
import React from "react";
import { Typography, Image, Button, Input } from "antd";
import AudioPlayer from "react-h5-audio-player";
//component
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
import demo from "../../../../assets/1.1.mp3";
//others
import "./style.css";
import "react-h5-audio-player/lib/styles.css";

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
      <div style={{ marginTop: 30 }}>
        <AudioPlayer
          src={demo}
          showJumpControls={false}
          autoPlay={false}
          onPlay={(e) => console.log("onPlay")}
          // other props here
        />
      </div>
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
        <CorrectAnswerRadio amount={4} />
      </div>
    </div>
  );
};
export default QuestionComponent;

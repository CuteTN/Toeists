// libs
import React from "react";
import { Typography, Image, Button, Input, Row } from "antd";
//components
import AudioPlayer from "react-h5-audio-player";
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";
import { deleteFile, uploadFile } from "../../../../services/api/file";

const { Text } = Typography;
const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, patchQuestion] = usePatch({
    audio: "",
    answer: "",
  });

  React.useEffect(() => {
    onQuestionChange?.(questionId, question)
  }, [question])

  //#region handle audio
  const audioFileInputRef = React.useRef(null);

  const handleOpenAddAudio = () => {
    audioFileInputRef.current.click()
  }

  const handleDeleteAudio = () => {
    deleteFile(question?.audio).then(() => {
      patchQuestion(['audio'], '');
    })
  }

  const handleSelectedAudioChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      deleteFile(question?.audio).then(() => {
        uploadFile("audio", selectedFile)
          .then(res => {
            const newUrl = res?.data?.url;
            patchQuestion(['audio'], newUrl);
          })
      });
    }
  }
  //#endregion

  const handleQuestionRemove = () => {
    patchQuestion(["isDeleted"], true);
    deleteFile(question?.audio);
  }

  return (
    <div className="question-component-wrapper">
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
      <div style={{ marginTop: 30 }}>
        <AudioPlayer
          src={question?.audio}
          showJumpControls={false}
          autoPlay={false}
          autoPlayAfterSrcChange={false}
        />
      </div>
      <div className="add-button">
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleOpenAddAudio}
        >
          {question?.audio ? "CHANGE AUDIO" : "ADD AUDIO"}
        </Button>
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleDeleteAudio}
          disabled={!question?.audio}
        >
          DELETE AUDIO
        </Button>
      </div>
      <div>
        <CorrectAnswerRadio amount={3} onChange={v => patchQuestion(["answer"], v)} />
      </div>

      <input
        type="file"
        name="myAudio"
        accept="audio/*"
        ref={audioFileInputRef}
        style={{ display: "none" }}
        onChange={handleSelectedAudioChange}
      ></input>
    </div>
  );
};
export default QuestionComponent;

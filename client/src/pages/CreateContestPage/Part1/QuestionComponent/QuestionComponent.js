// libs
import React from "react";
import { Typography, Image, Button, Input, Row } from "antd";
import AudioPlayer from "react-h5-audio-player";
//component
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
import noImage from "../../../../assets/no-image.png"
//others
import "./style.css";
import "react-h5-audio-player/lib/styles.css";
import { deleteFile, uploadFile } from "../../../../services/api/file";
import { usePatch } from "../../../../hooks/usePatch";

const { Text } = Typography;

const QuestionComponent = ({ questionId, onQuestionChange }) => {
  const [question, setQuestion, patchQuestion] = usePatch({
    audio: "",
    image: "",
    answer: "",
  });

  React.useEffect(() => {
    onQuestionChange?.(questionId, question)
  }, [question])

  //#region handle image
  const imageFileInputRef = React.useRef(null);

  const handleOpenAddImage = () => {
    imageFileInputRef.current.click()
  }

  const handleDeleteImage = () => {
    deleteFile(question?.image).then(() => {
      patchQuestion(['image'], '');
    })
  }

  const handleSelectedImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      deleteFile(question?.image).then(() => {
        uploadFile("image", selectedFile)
          .then(res => {
            const newUrl = res?.data?.url;
            patchQuestion(['image'], newUrl);
          })
      });
    }
  }
  //#endregion

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
    deleteFile(question?.image);
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
      <Image
        src={question?.image || noImage}
        preview={!!question?.image}
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
        <Button
          className="orange-button"
          style={{ fontWeight: "bold" }}
          onClick={handleOpenAddImage}
        >
          {question?.image ? "CHANGE IMAGE" : "ADD IMAGE"}
        </Button>
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleDeleteImage}
          disabled={!question?.image}
        >
          DELETE IMAGE
        </Button>
      </div>
      <div>
        <CorrectAnswerRadio amount={4} onChange={v => patchQuestion(["answer"], v)} />
      </div>

      <input
        type="file"
        name="myImage"
        accept="image/*"
        ref={imageFileInputRef}
        style={{ display: "none" }}
        onChange={handleSelectedImageChange}
      ></input>

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

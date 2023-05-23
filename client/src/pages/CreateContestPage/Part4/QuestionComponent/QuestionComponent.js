// libs
import React, { useState } from "react";
import { Typography, Image, Button, Input, Row } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
import AudioPlayer from "react-h5-audio-player";

//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";
import { deleteFile, uploadFile } from "../../../../services/api/file";


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
      <Input.TextArea
        name="question"
        placeholder="Question"
        style={{ height: 70 }}
        onChange={e => handleInputChange(e, ["question"])}
      />
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


const { Text } = Typography;
const ParagraphComponent = ({ paragraphId, onParagraphChange }) => {
  const [paragraph, setParagraph, patchParagraph] = usePatch({
    audio: '',
    questions: [{}],
  });

  React.useEffect(() => {
    onParagraphChange?.(paragraphId, paragraph)
  }, [paragraph])

  const handleQuestionChange = (questionId, question) => {
    patchParagraph(["questions", questionId], question);
  }

  const handleAddQuestionClick = () => {
    const newId = paragraph?.questions?.length;
    patchParagraph(["questions", newId], {});
  };

  //#region handle audio
  const audioFileInputRef = React.useRef(null);

  const handleOpenAddAudio = () => {
    audioFileInputRef.current.click()
  }

  const handleDeleteAudio = () => {
    deleteFile(paragraph?.audio).then(() => {
      patchParagraph(['audio'], '');
    })
  }

  const handleSelectedAudioChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      deleteFile(paragraph?.audio).then(() => {
        uploadFile("audio", selectedFile)
          .then(res => {
            const newUrl = res?.data?.url;
            patchParagraph(['audio'], newUrl);
          })
      });
    }
  }
  //#endregion

  const handleParagraphRemove = () => {
    patchParagraph(["isDeleted"], true);
    deleteFile(paragraph?.audio);
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
      <div style={{ marginTop: 30 }}>
        <AudioPlayer
          src={paragraph?.audio}
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
          {paragraph?.audio ? "CHANGE AUDIO" : "ADD AUDIO"}
        </Button>
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 10 }}
          onClick={handleDeleteAudio}
          disabled={!paragraph?.audio}
        >
          DELETE AUDIO
        </Button>
      </div>
      <div className="answer">
        {paragraph?.questions?.map((question, i) => (
          <div key={i} hidden={!!question?.isDeleted}>
            <QuestionComponent questionId={i} onQuestionChange={handleQuestionChange} />
          </div>
        ))}
      </div>
      <Button
        className="orange-button"
        style={{ fontWeight: "bold", margin: 15 }}
        onClick={handleAddQuestionClick}
      >
        ADD A QUESTION
      </Button>

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
export default ParagraphComponent;

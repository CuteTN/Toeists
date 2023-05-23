// libs
import React, { useState } from "react";
import { Typography, Input, Button, Image, Row } from "antd";
//components
import CorrectAnswerRadio from "../../CorrectAnswerRadio/CorrectAnswerRadio";
//others
import "./style.css";
import { usePatch } from "../../../../hooks/usePatch";
import { deleteFile, uploadFile } from "../../../../services/api/file";
import noImage from '../../../../assets/no-image.png'

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

  const handleQuestionRemove = () => {
    patchQuestion(["isDeleted"], true);
    deleteFile(question?.image);
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

const ParagraphComponent = ({ paragraphId, onParagraphChange }) => {
  const [paragraph, setParagraph, patchParagraph] = usePatch({
    paragraph: '',
    questions: [{}],
    image: '',
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

  //#region handle image
  const imageFileInputRef = React.useRef(null);

  const handleOpenAddImage = () => {
    imageFileInputRef.current.click()
  }

  const handleDeleteImage = () => {
    deleteFile(paragraph.image).then(() => {
      patchParagraph(['image'], '');
    })
  }

  const handleSelectedImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      deleteFile(paragraph.image).then(() => {
        uploadFile("image", selectedFile)
          .then(res => {
            const newUrl = res?.data?.url;
            patchParagraph(['image'], newUrl);
          })
      });
    }
  }
  //#endregion

  const UpdateImageButton = () => {
    return (
      <div className="button-add-image">
        <Button
          className="orange-button"
          style={{ fontWeight: "bold", margin: 15 }}
          onClick={handleOpenAddImage}
        >
          Add Image
        </Button>
        <Button
          className="orange-button"
          style={{ fontWeight: "bold" }}
          onClick={handleDeleteImage}
        >
          Delete Image
        </Button>
      </div>
    );
  };

  const handleParagraphRemove = () => {
    patchParagraph(["isDeleted"], true);
    deleteFile(paragraph?.image);
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
      <div className="paragraph-image">
        <Image
          src={paragraph.image || noImage}
          preview={!!paragraph.image}
          style={{
            maxHeight: "40vh",
            width: "100%",
            objectFit: "revert",
            height: "auto",
            display: "block",
          }}
        >
        </Image>
        <Input.TextArea
          name="paragraph"
          placeholder="Paragraph"
          style={{ height: 300 }}
          onChange={e => handleInputChange(e, ["paragraph"])}
        />

        <UpdateImageButton />
      </div>

      <div className="answer">
        {paragraph?.questions?.map((question, i) => (
          <div key={i} hidden={!!question.isDeleted}>
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
        name="myImage"
        accept="image/*"
        ref={imageFileInputRef}
        style={{ display: "none" }}
        onChange={handleSelectedImageChange}
      ></input>
    </div>
  );
};
export default ParagraphComponent;

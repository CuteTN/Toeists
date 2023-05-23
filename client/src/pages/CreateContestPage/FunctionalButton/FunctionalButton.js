// libs
import React from "react";
import { Button, message, Typography } from "antd";
//others
import "../style.css";
import { createContestPart } from "../../../services/api/contest";
import { useHistory } from "react-router-dom";

const { Text } = Typography;
const FunctionalButton = ({ hasParagraphs = false, onAddContentClick, contest }) => {
  const history = useHistory();

  const handleSubmitClick = () => {
    createContestPart(contest)
      .then(res => {
        message.success({
          content: "Contest created!",
          onClose: () => {
            history.push(`/contest/${res.data._id}`);
          }
        });
      })
      .catch(err => {
        const errMsg = err?.response?.data?.message
        if (errMsg)
          message.error({
            content: errMsg,
          })
      })
  }

  return (
    <div className="functional-button">
      <Button
        className="orange-button"
        style={{ fontWeight: "bold", margin: 15 }}
        onClick={onAddContentClick}
      >
        {hasParagraphs ? "ADD PARAGRAPH" : "ADD QUESTION"}
      </Button>
      <Button
        className="orange-button"
        style={{ fontWeight: "bold" }}
        onClick={handleSubmitClick}
      >
        CREATE
      </Button>
    </div>
  );
};
export default FunctionalButton;

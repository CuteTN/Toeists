// libs
import React from "react";
import { Button, Typography } from "antd";
//others
import "../style.css";

const { Text } = Typography;
const FunctionalButton = ({ part, hasParagraphs = false }) => {
  const handleClick = () => {};
  const handleCreate = () => {};
  return (
    <div className="functional-button">
      <Button
        className="orange-button"
        style={{ fontWeight: "bold", margin: 15 }}
        onClick={handleClick}
      >
        {hasParagraphs? "ADD PARAGRAPH" : "ADD QUESTION"}
      </Button>
      <Button
        className="orange-button"
        style={{ fontWeight: "bold" }}
        onClick={handleCreate}
      >
        CREATE
      </Button>
    </div>
  );
};
export default FunctionalButton;

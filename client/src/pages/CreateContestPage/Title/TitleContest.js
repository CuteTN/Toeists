// libs
import React from "react";
import { Input, Typography } from "antd";
//others
import "../style.css";
const { Text } = Typography;
const TitleContest = ({ part, onTitleChange }) => {
  const handleTitleChange = (e) => {
    onTitleChange?.(e.target.value);
  }

  return (
    <div>
      <div className="row">
        <div
          style={{
            paddingLeft: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: 700 }}>{part}</Text>
        </div>
      </div>
      <hr />
      <div className="title">
        <p className="title-question">Contest title</p>
        <Input name="title" placeholder="Contest title" onChange={handleTitleChange}/>
      </div>
    </div>
  );
};
export default TitleContest;

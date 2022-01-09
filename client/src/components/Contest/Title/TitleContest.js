import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const TitleContest = ({ contest }) => {
  return (
    <div className="break-word">
      <Title level={2}>
        [{contest?.part}] {contest?.title}
      </Title>
    </div>
  );
};

export default TitleContest;

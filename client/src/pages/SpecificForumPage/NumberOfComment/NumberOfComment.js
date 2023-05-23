import React from "react";
import { Typography, Row } from "antd";

const { Title, Text } = Typography;
function NumberOfComment({ comments }) {
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Title className="mb-4" level={2}>
          {`Comments (${comments?.length})`}
        </Title>
      </Row>
    </div>
  );
}

export default NumberOfComment;

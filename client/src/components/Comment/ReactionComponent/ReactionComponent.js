import React, { useState } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import styles from "./styles";
import { LinkOutlined, HeartOutlined } from "@ant-design/icons";

const { Text } = Typography;
const ReactionComponent = ({ comment }) => {
  const [interactions, setInteractions] = useState({});

  const handleUpvoteClick = async (id) => {};

  return (
    <div style={styles.item}>
      <Row className="justify-content-between mb-4">
        <Row>
          <Space size="large">
            <Space>
              <Tooltip title="React">
                <HeartOutlined
                  className="clickable icon"
                  onClick={() => handleUpvoteClick(comment?._id)}
                />
              </Tooltip>
              <Text strong style={{ fontSize: "1.5rem" }}>
                {/* {comment?.interactionInfo?.upvoterIds?.length} */}
                108
              </Text>
            </Space>
          </Space>
        </Row>
      </Row>
    </div>
  );
};

export default ReactionComponent;

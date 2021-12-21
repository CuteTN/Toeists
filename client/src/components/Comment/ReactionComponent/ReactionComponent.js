import React, { useState, useEffect } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import styles from "./styles";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Text } = Typography;
const ReactionComponent = ({ comment }) => {
  const [isReacted, setIsReacted] = useState(false);

  useEffect(() => {
    // kiểm tra react chưa
  }, []);

  const handleClick = () => {
    console.log("Đây bạn ơi");
  };

  return (
    <div style={styles.item}>
      <Row className="justify-content-between mb-4">
        <Row>
          <Space size="large">
            <Space>
              <Tooltip title="React">
                {isReacted ? (
                  <HeartFilled
                    className="clickable icon"
                    onClick={() => handleClick(comment?._id)}
                  />
                ) : (
                  <HeartOutlined
                    className="clickable icon"
                    onClick={() => handleClick(comment?._id)}
                  />
                )}
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

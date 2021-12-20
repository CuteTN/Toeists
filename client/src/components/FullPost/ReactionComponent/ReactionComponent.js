import React, { useState } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import styles from "./styles";
import { LinkOutlined, HeartOutlined } from "@ant-design/icons";
import ShareButton from "../ShareButton/ShareButton";

const { Text } = Typography;
const ReactionComponent = ({ post }) => {
  const [interactions, setInteractions] = useState({});

  const handleUpvoteClick = async (id) => {};

  const copyLink = (id) => {
    navigator.clipboard
      .writeText(`http://localhost:3000/forum/${id}`) // change to deployment link later
      .then(() => message.success("Link copied to clipboard"))
      .catch((error) => {
        message.error("Something goes wrong copying link");
        console.log(id);
      });
  };

  return (
    <div style={styles.item}>
      <Row className="justify-content-between mb-4">
        <Row>
          <Space size="large">
            <Space>
              <Tooltip title="React">
                <HeartOutlined
                  className="clickable icon"
                  onClick={() => handleUpvoteClick(post?._id)}
                />
              </Tooltip>
              <Text strong style={{ fontSize: "1.5rem" }}>
                108
              </Text>
            </Space>
          </Space>
        </Row>
        <Row>
          <Space size="large">
            <Tooltip title="Copy link">
              <LinkOutlined
                className="clickable icon"
                onClick={() => copyLink(post._id)}
              />
            </Tooltip>
            <ShareButton post={post} />
          </Space>
        </Row>
      </Row>
    </div>
  );
};

export default ReactionComponent;

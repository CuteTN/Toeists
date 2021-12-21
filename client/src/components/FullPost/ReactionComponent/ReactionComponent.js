import React, { useState, useEffect } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import styles from "./styles";
import { LinkOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import ShareButton from "../ShareButton/ShareButton";
import { interactWithForum } from "../../../services/api/forum";
import { useAuth } from '../../../contexts/authenticationContext'

const { Text } = Typography;
const ReactionComponent = ({ post }) => {
  const { signedInUser } = useAuth();
  // TODO: get actual interaction info of current user
  const myInteractions = React.useMemo(() => ({}), [post, signedInUser?._id]);

  const handleToggleVoteClick = () => {
    // interactWithForum(post._id, "upvote");    
  };

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
                {myInteractions ? (
                  <HeartFilled
                    className="clickable icon"
                    onClick={() => handleToggleVoteClick(post?._id)}
                  />
                ) : (
                  <HeartOutlined
                    className="clickable icon"
                    onClick={() => handleToggleVoteClick(post?._id)}
                  />
                )}
              </Tooltip>
              <Text strong style={{ fontSize: "1.5rem" }}>
                {post?.interactionInfo?.upvoterIds?.length}
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

import React, { useState, useEffect } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import styles from "./styles";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/authenticationContext";
import { getInteractionInfoOfUser } from "../../../services/InteractionInfoService";
import { interactWithComment } from "../../../services/api/comment";

const { Text } = Typography;
const ReactionComponent = ({ comment }) => {
  const { signedInUser } = useAuth();
  const [hasUpvoted, setHasUpvoted] = React.useState(false);
  const [upvotersCount, setUpvotersCount] = React.useState(0);

  useEffect(() => {
    setHasUpvoted(getInteractionInfoOfUser(signedInUser?._id, comment?.interactionInfo).hasUpvoted)
    setUpvotersCount(comment?.interactionInfo?.upvoterIds?.length ?? 0);
  }, [comment, signedInUser?._id])

  const handleToggleVoteClick = () => {
    setHasUpvoted(!hasUpvoted);
    setUpvotersCount(hasUpvoted ? upvotersCount - 1 : upvotersCount + 1);
    interactWithComment(comment._id, hasUpvoted ? "unvote" : "upvote")
      .catch(() => {
        setHasUpvoted(hasUpvoted);
        setUpvotersCount(hasUpvoted ? upvotersCount + 1 : upvotersCount - 1);
      })
  };

  return (
    <div style={styles.item}>
      <Row className="justify-content-between mb-4">
        <Row>
          <Space size="large">
            <Space>
              <Tooltip title={hasUpvoted ? "Unvote" : "Upvote"}>
                {hasUpvoted ? (
                  <HeartFilled
                    className="clickable icon"
                    onClick={handleToggleVoteClick}
                  />
                ) : (
                  <HeartOutlined
                    className="clickable icon"
                    onClick={handleToggleVoteClick}
                  />
                )}
              </Tooltip>
              <Text strong style={{ fontSize: "1.5rem" }}>
                {upvotersCount}
              </Text>
            </Space>
          </Space>
        </Row>
      </Row>
    </div>
  );
};

export default ReactionComponent;

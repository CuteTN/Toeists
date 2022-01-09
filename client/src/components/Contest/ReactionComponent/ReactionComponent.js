import React, { useState, useEffect } from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import { Link } from "react-router-dom";
import styles from "./styles";
import { LinkOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import ShareButton from "../../FullPost/ShareButton/ShareButton";
import { useAuth } from "../../../contexts/authenticationContext";
import { getInteractionInfoOfUser } from "../../../services/InteractionInfoService";
import { interactWithForum } from "../../../services/api/forum";

const { Text } = Typography;
const ReactionComponent = ({ post }) => {
  const { signedInUser } = useAuth();
  const [hasUpvoted, setHasUpvoted] = React.useState(false);
  const [upvotersCount, setUpvotersCount] = React.useState(0);

  useEffect(() => {
    setHasUpvoted(
      getInteractionInfoOfUser(signedInUser?._id, post?.interactionInfo)
        .hasUpvoted
    );
    setUpvotersCount(post?.interactionInfo?.upvoterIds?.length ?? 0);
  }, [post, signedInUser?._id]);

  const handleToggleVoteClick = () => {
    setHasUpvoted(!hasUpvoted);
    setUpvotersCount(hasUpvoted ? upvotersCount - 1 : upvotersCount + 1);
    interactWithForum(post._id, hasUpvoted ? "unvote" : "upvote").catch(() => {
      setHasUpvoted(hasUpvoted);
      setUpvotersCount(hasUpvoted ? upvotersCount + 1 : upvotersCount - 1);
    });
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
              <Link to={`/forums/${post?._id}`} target="_blank">
                <Text
                  style={{ fontSize: "1.2rem" }}
                  className=" clickable bold mx-2"
                >{`Comment(${post?.comments?.length})`}</Text>
              </Link>
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

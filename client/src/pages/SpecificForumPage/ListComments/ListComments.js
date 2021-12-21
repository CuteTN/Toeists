import React, { useState } from "react";
import { Typography, Row } from "antd";
import Comment from "../../../components/Comment/Comment";

const { Title, Text } = Typography;
const ListComments = ({ post }) => {
  const [focusedCommentIndex, setFocusedCommentIndex] = useState(-1);

  const handleReplyComment = async (commentId, inputComment) => {
    // await commentsApi.replyComment(post._id, commentId, inputComment);
    // fetchComments();
  };

  const handleEditComment = async (commentId, newComment) => {
    // await commentsApi.editComment(commentId, newComment);
    // fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    // await commentsApi.deleteComment(commentId);
    // fetchComments();
  };

  const handleCopyCommentLink = (id) => {
    // navigator.clipboard
    //   .writeText(`${FRONTEND_URL}/post/${post?._id}/${id}`) // change to deployment link later
    //   .then(() => message.success("Link copied to clipboard"))
    //   .catch((error) => {
    //     message.error("Something goes wrong copying link");
    //     // console.log(id);
    //   });
  };

  const handleInteractionCallback = () => {
    // console.log("interaction call back");
    // fetchComments();
  };

  return (
    <div style={{ margin: -20, marginTop: 0 }}>
      {post?.comments?.map((c, i) => (
        <div key={i}>
          <Comment
            comment={c}
            onReply={handleReplyComment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onCopyCommentLink={handleCopyCommentLink}
            isFocus={focusedCommentIndex > -1 && i === 0}
            postId={post?._id}
            interactionCallback={() => handleInteractionCallback()}
          />
        </div>
      ))}
    </div>
  );
};

export default ListComments;

import React from "react";
import { Typography, Row } from "antd";

const { Title, Text } = Typography;
function ListComments({ comments }) {
  return (
    <div style={{ margin: -20, marginTop: 0 }}>
      {comments?.map((c, i) => (
        <div key={i}>
          {/* <Comment
                        comment={c}
                        onReply={handleReplyComment}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                        onCopyCommentLink={handleCopyCommentLink}
                        isFocus={focusedCommentIndex > -1 && i === 0}
                        postId={post?._id}
                        interactionCallback={() => handleInteractionCallback()}
                      /> */}
        </div>
      ))}
    </div>
  );
}

export default ListComments;

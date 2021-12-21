import React, { useState } from "react";
import { Divider } from "antd";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import CommentForm from "../CommentForm/CommentForm";
import OwnerInformation from "./OwnerInformation/OwnerInformation";
import DOMPurify from "dompurify";
import ReactionComponent from "./ReactionComponent/ReactionComponent";

const Comment = ({ comment, onEdit, onDelete, isFocus }) => {
  const [isEdit, setIsEdit] = useState(false);

  const renderEdit = () => {
    const handleDiscard = () => {
      setIsEdit(false);
    };

    const blocksFromHTML = convertFromHTML(comment?.content);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return (
      <CommentForm
        label="Edit comment"
        onSubmit={handleEdit}
        onDiscard={handleDiscard}
        editor={EditorState.createWithContent(state)}
      />
    );
  };

  const handleEdit = (newComment) => {
    setIsEdit(false);
    const result = {
      content: newComment,
      forumId: comment?.forumId,
    };
    onEdit(comment?._id, result);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div
      className={isFocus ? "bg-green-smoke pt-4" : ""}
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
      <OwnerInformation
        comment={comment}
        onDelete={onDelete}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      {!isEdit ? (
        <div>
          <div
            className="pb-2"
            dangerouslySetInnerHTML={createMarkup(comment?.content)}
          ></div>
          <ReactionComponent comment={comment} />
        </div>
      ) : (
        renderEdit()
      )}

      <Divider />
    </div>
  );
};

export default Comment;

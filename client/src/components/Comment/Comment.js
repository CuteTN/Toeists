import React, { useState, useEffect, useReducer } from "react";
import {
  Avatar,
  Typography,
  Row,
  Space,
  Divider,
  Menu,
  Dropdown,
  message,
  Tooltip,
  Modal,
} from "antd";
import {
  EllipsisOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LinkOutlined,
  DeleteFilled,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import COLOR from "../../constants/colors";
import CommentForm from "../CommentForm/CommentForm";

import OwnerInformation from "./OwnerInformation/OwnerInformation";

const { Text } = Typography;
const { confirm } = Modal;

const allInteractionReducer = (state, action) => {
  switch (action.type) {
    case "upvote":
      return { ...state, upvotes: state.upvotes + 1 };
    case "downvote":
      return { ...state, downvotes: state.downvotes + 1 };
    case "unupvote":
      return { ...state, upvotes: state.upvotes - 1 };
    case "undownvote":
      return { ...state, downvotes: state.downvotes - 1 };
    default:
      return state;
  }
};

const Comment = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  onCopyCommentLink,
  isFocus,
  postId,
  interactionCallback,
}) => {
  const [myInteractions, setMyInteractions] = useState({});
  const [isReply, setIsReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [ellipsis, setEllipsis] = useState("full");

  const [allInteractions, dispatchInteractions] = useReducer(
    allInteractionReducer,
    {
      upvotes: comment?.interactionInfo?.listUpvotes?.length,
      downvotes: comment?.interactionInfo?.listDownvotes?.length,
      // upvotes: listInteractions.upvoteslength,
      // downvotes: listInteractions.downvoteslength,
      // add more items later
    }
  );

  useEffect(() => {
    // setPost(props.post);
    fetchMyInteractions();
    // setListInteractions({
    //   upvoteslength: post?.interactionInfo?.listUpvotes?.length,
    //   downvoteslength: post?.interactionInfo?.listDownvotes?.length,
    // });
  }, [comment]);

  const handleUpvoteClick = async (id) => {
    // if (!user) {
    //   message.info("You need to log in to upvote this comment!");
    //   return;
    // }
    // if (myInteractions?.upvote) {
    //   unvoteComment(id, postId)
    //     .then((res) => {
    //       interactionCallback();
    //       fetchMyInteractions().then(() =>
    //         dispatchInteractions({ type: "unupvote" })
    //       );
    //     })
    //     .catch((error) => {
    //       message.error("Something goes wrong with comment unvote");
    //       console.log(error);
    //     });
    // } else {
    //   upvoteComment(id, postId)
    //     .then((res) => {
    //       interactionCallback();
    //       if (myInteractions?.downvote) {
    //         dispatchInteractions({ type: "undownvote" });
    //       }
    //       fetchMyInteractions().then(() =>
    //         dispatchInteractions({ type: "upvote" })
    //       );
    //     })
    //     .catch((error) => {
    //       message.error("Something goes wrong with comment upvote");
    //       console.log(error);
    //     });
    // }
  };

  const handleDownvoteClick = async (id) => {
    // if (!user) {
    //   message.info("You need to log in to downvote this comment!");
    //   return;
    // }
    // if (myInteractions?.downvote) {
    //   unvoteComment(id, postId)
    //     .then((res) => {
    //       interactionCallback();
    //       fetchMyInteractions().then(() =>
    //         dispatchInteractions({ type: "undownvote" })
    //       );
    //     })
    //     .catch((error) => {
    //       message.error("Something goes wrong with comment unvote");
    //       console.log(error);
    //     });
    // } else {
    //   downvoteComment(id, postId)
    //     .then((res) => {
    //       interactionCallback();
    //       if (myInteractions?.upvote) {
    //         dispatchInteractions({ type: "unupvote" });
    //       }
    //       fetchMyInteractions().then(() =>
    //         dispatchInteractions({ type: "downvote" })
    //       );
    //     })
    //     .catch((error) => {
    //       message.error("Something goes wrong with comment downvote");
    //       console.log(error);
    //     });
    // }
  };

  const fetchMyInteractions = () => {
    // if (!user) return;
    // const interactions = getMyCommentInteractions(comment._id)
    //   .then((res) => {
    //     setMyInteractions(res.data);
    //     return res.data;
    //   })
    //   .catch((error) => {
    //     message.error("Something goes wrong with comment interactions");
    //     console.log(error);
    //   });
    // return interactions;
  };

  const toggleReply = () => {
    setIsReply((prev) => !prev);
    // console.log("comment", comment);
  };
  const handleReply = (newComment) => {
    onReply(comment?._id, newComment);
    setIsReply(false);
  };
  const renderEdit = () => {
    const handleDiscard = () => {
      setIsEdit(false);
    };
    return (
      <CommentForm
        label="Edit comment"
        onSubmit={handleEdit}
        onDiscard={handleDiscard}
        initContent={comment?.content}
      />
    );
  };

  const commentUpdated = (newComment, oldComment) => {
    if (newComment?.content !== oldComment?.content) return true;

    return false;
  };

  const handleEdit = (newComment) => {
    setIsEdit(false);

    if (commentUpdated(newComment, comment)) onEdit(comment?._id, newComment);
  };
  const handleDiscardReply = () => {
    setIsReply(false);
  };

  const copyLink = (id) => {
    onCopyCommentLink(id);
  };

  return (
    <div
      className={isFocus ? "bg-green-smoke pt-4" : ""}
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
      <OwnerInformation comment={comment} onDelete={onDelete} />
      {/* {!isEdit ? (
        <div>
          {comment?.quotedCommentId !== undefined ? (
            <div
              className="p-3 mb-3"
              style={{ backgroundColor: COLOR.whiteSmoke }}
            >
              <Row
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {comment?.quotedCommentId === null ? (
                  <Text className="italic">Deleted comment</Text>
                ) : (
                  <Text className="black bold clickable">{`${comment?.quotedCommentId?.userId?.name}'s comment`}</Text>
                )}
                {comment?.quotedCommentId === null ? null : (
                  <Text className="clickable" underline type="secondary">
                    {`Last edited ${moment(
                      comment?.quotedCommentId?.contentUpdatedAt
                    ).fromNow()}`}
                  </Text>
                )}
              </Row>
              <MarkdownRenderer
                text={comment?.quotedCommentId?.content}
                enableDoubleClickFullScreen
              />

            </div>
          ) : null}
          <div className="mb-2">
            <div>
             
              <MarkdownRenderer
                text={comment?.content}
                enableDoubleClickFullScreen
              />
            </div>
            {ellipsis !== "full" && <div className="bottom-fade"></div>}
          </div>
          <Row className="justify-content-between mb-4">
            <Row>
              <Space size="large">
                <Space>
                  <Text strong style={{ fontSize: "1.5rem" }}>
                    {comment?.interactionInfo?.listUpvotes?.length}
                  </Text>
                  <Tooltip title="Upvote">
                    <ArrowUpOutlined
                      className={`clickable icon ${
                        myInteractions?.upvote ? "green" : "black"
                      }`}
                      onClick={() => handleUpvoteClick(comment._id)}
                    />
                  </Tooltip>
                  <Tooltip title="Downvote">
                    <ArrowDownOutlined
                      className={`clickable icon ${
                        myInteractions?.downvote ? "green" : "black"
                      }`}
                      onClick={() => handleDownvoteClick(comment._id)}
                    />
                  </Tooltip>
                  <Text strong style={{ fontSize: "1.5rem" }}>
                    {comment?.interactionInfo?.listDownvotes?.length}
                  </Text>
                </Space>
                <Text onClick={toggleReply} className="clickable" strong>
                  {isReply ? `Discard` : `Reply`}
                </Text>
              </Space>
            </Row>
            <Row>
              <Space size="large">
                <Tooltip title="Get link">
                  <LinkOutlined
                    className="clickable icon"
                    onClick={() => copyLink(comment?._id)}
                  />
                </Tooltip>
              </Space>
            </Row>
          </Row>
          {isReply ? (
            <CommentForm
              onSubmit={handleReply}
              label={`Replying to ${comment?.userId?.name}'s comment`}
              onDiscard={handleDiscardReply}
            />
          ) : null}
        </div>
      ) : (
        renderEdit()
      )} */}

      <Divider />
    </div>
  );
};

export default Comment;

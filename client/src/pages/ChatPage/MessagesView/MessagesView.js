// lib
import React, { useEffect, useState } from "react";
import moment from "moment";
import { message as messageAntd, Modal, Tooltip, Avatar } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// context
import { useAuth } from "../../../contexts/authenticationContext";
//others
import "./style.css";
import { useMessage } from "../../../hooks/useMessage";
import useOnScreen from "../../../hooks/useOnScreen";
import { FaAngleDoubleDown } from "react-icons/all";
import { useHistory } from "react-router-dom";
import { ConversationService } from "../../../services/ConversationService";
import COLOR from "../../../constants/colors";

const NEW_MESSAGE_MESSAGE_KEY = "NEW_MESSAGE_MESSAGE_KEY";

const MessagesView = ({ conversation }) => {
  const { signedInUser } = useAuth();
  const bottomDivRef = React.useRef();
  const isAtBottom = useOnScreen(bottomDivRef);
  const messageHandler = useMessage();
  const messagesPrevLengthRef = React.useRef();
  const isJustSentRef = React.useRef(false);
  const history = useHistory();

  /** @type {any[]} */
  const messages = React.useMemo(() => conversation?.messages, [conversation]);

  /** @type {any[]} */
  const seeners = React.useMemo(() => ConversationService.getSeeners(conversation), [conversation]);


  const [toBeDeletedMessages, setToBeDeletedMessages] = useState([]);

  const membersDict = React.useMemo(() => {
    const result = {};
    conversation?.members?.forEach(m => result[m.memberId] = m);
    return result;
  }, [conversation])

  const scrollToBottom = (smooth = false) => {
    bottomDivRef.current?.scrollIntoView(smooth ? { behavior: "smooth" } : undefined);
  }

  useEffect(() => {
    scrollToBottom();
    isJustSentRef.current = false;
  }, [conversation?._id])

  useEffect(() => {
    const offSent = messageHandler.onSent(data => {
      if (data.res.conversationId === conversation?._id)
        isJustSentRef.current = true;
    })

    return offSent;
  }, [messageHandler])

  useEffect(() => {
    if (messagesPrevLengthRef.current == null) {
      messagesPrevLengthRef.current = conversation?.messages?.length;
      return;
    }

    if (messagesPrevLengthRef.current < conversation?.messages?.length) {
      if (isAtBottom || isJustSentRef.current) {
        scrollToBottom(true);
        isJustSentRef.current = false;
      }
      else {
        messageAntd.info({
          key: NEW_MESSAGE_MESSAGE_KEY,
          content: "There are new messages!",
          duration: 3,
          icon: <FaAngleDoubleDown className="mr-2" />,
          onClick: () => {
            scrollToBottom(true),
              messageAntd.destroy(NEW_MESSAGE_MESSAGE_KEY);
          }
        })
      }
    }

    messagesPrevLengthRef.current < conversation?.messages?.length
  }, [conversation?.messages?.length])

  const isMyMessage = (message) => {
    return message?.senderId === signedInUser?._id;
  };

  const handleUserAvatarClick = (user) => {
    if (user?._id)
      history.push(`/userinfo/${user._id}`)
  }

  const ListSeeners = () => {
    return (
      <div className="d-flex flex-row-reverse" style={{ width: "100%", marginTop: -30, }}>
        <Avatar.Group className="m-1 mr-2">
          {seeners?.map((member, i) =>
            <div key={i} onClick={e => handleUserAvatarClick(member?.member)}>
              <Avatar
                src={member?.member?.avatarUrl}
                size={25}
                style={{ cursor: "pointer" }}
              >
                {member?.member?.username}
              </Avatar>
            </div>
          )}
        </Avatar.Group>
      </div>
    )
  }

  return (
    <div className="message-form-wrapper">
      {messages?.map((msg, i) => (
        <div key={i}>
          {isMyMessage(msg) ? (
            <div key={msg.toString()} className="message-row you-message">
              <div className="message-content">
                <div className="d-flex align-msgs-center">
                  <Tooltip
                    title={moment(msg.createdAt).format("MMMM Do YYYY")}
                    placement="top"
                  >
                    <div className="message-text">{msg.text}</div>
                  </Tooltip>
                </div>
                <div className="message-time">
                  {moment(msg.createdAt).format("h:mm:ss a")}
                </div>
              </div>
            </div>
          ) : (
            <div key={msg._id} className="message-row other-message ">
              <div className="message-content">
                <Tooltip placement="bottom">
                  <div onClick={() => handleUserAvatarClick(membersDict?.[msg.senderId]?.member)}>
                    <Avatar
                      src={membersDict?.[msg.senderId]?.member?.avatarUrl}
                      size={40}
                      style={{ 
                        cursor: "pointer",
                        borderColor: COLOR.yellow,
                        borderWidth: 3,
                        borderStyle: membersDict?.[msg.senderId]?.role === "admin"? "solid" : "none",
                      }}
                    >
                      {membersDict?.[msg.senderId]?.member?.username}
                    </Avatar>
                  </div>
                </Tooltip>
                <div className="d-flex" style={{ marginLeft: -10 }}>
                  <Tooltip
                    title={moment(msg.createdAt).format("MMMM Do YYYY")}
                    placement="top"
                  >
                    <div className="message-text">{msg.text}</div>
                  </Tooltip>
                </div>
                <div className="message-time" style={{ width: 128 }}>
                  {moment(msg.createdAt).format("h:mm:ss a")}
                </div>
              </div>
            </div>
          )}
          <br />
        </div>
      ))}
      {ListSeeners()}
      <div
        ref={bottomDivRef}
        style={{ marginTop: -250 }}
      />
    </div>
  );
};
export default MessagesView;

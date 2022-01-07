// lib
import React, { useState } from "react";
import moment from "moment";
import { Modal, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// context
import { useAuth } from "../../../contexts/authenticationContext";
//others
import "./style.css";

const MessagesView = ({ conversation }) => {
  const { signedInUser } = useAuth();

  /** @type {any[]} */
  const messages = React.useMemo(() => conversation?.messages, [conversation]);

  const [toBeDeletedMessages, setToBeDeletedMessages] = useState([]);

  const isMyMessage = (message) => {
    return message?.senderId === signedInUser?._id;
  };

  const handleDeleteMessage = () => {
    Modal.confirm({
      title: "Do you want to delete this message?",
      icon: <ExclamationCircleOutlined />,
      content: "You cannot undo this action",
      onOk() {},
      onCancel() {},
    });
  };

  return (
    <div className="message-form-wrapper">
      {messages?.map((msg, i) => (
        <div key={i}>
          {isMyMessage(msg) ? (
            <div key={msg.toString()} className="message-row you-message">
              <div className="message-content">
                <div className="d-flex align-msgs-center">
                  <Tooltip title="Delete">
                    <DeleteOutlined
                      className="clickable icon mr-2"
                      style={{ marginTop: 15 }}
                      onClick={() => handleDeleteMessage()}
                    />
                  </Tooltip>
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
            <div key={msg.toString()} className="message-row other-message ">
              <div className="message-content">
                <Tooltip placement="bottom">
                  <img
                    src="https://st4.depositphotos.com/4329009/19956/v/380/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
                    alt="dsd"
                    style={{ height: 30, marginTop: 10 }}
                  />
                </Tooltip>
                <div className="d-flex" style={{ marginLeft: -10 }}>
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
          )}
          <br />
        </div>
      ))}
    </div>
  );
};
export default MessagesView;

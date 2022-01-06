import React from "react";
import { Input, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "./style.css";

const InputChat = ({ onMessagePressSend }) => {
  const [text, setText] = React.useState("");

  const handleInputTextChange = (event) => {
    setText(event.target.value);
  };

  const handleMessagePressSend = () => {
    const message = { text };
    onMessagePressSend?.(message);
    setText("");
  };

  return (
    <div className="input-chat-wrapper">
      <Input
        autoSize={{ minRows: 1, maxRows: 1 }}
        className="input-chat"
        placeholder="Enter you message here."
        value={text}
        onChange={handleInputTextChange}
        onPressEnter={handleMessagePressSend}
      ></Input>
      <Tooltip title="Send">
        <SendOutlined
          style={{ marginTop: 4 }}
          className="clickable icon ml-4 mr-2"
          onClick={() => handleMessagePressSend()}
        />
      </Tooltip>
    </div>
  );
};
export default InputChat;

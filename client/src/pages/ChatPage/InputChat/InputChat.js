import React from "react";
import { Input } from 'antd'
import "./style.css";

const InputChat = ({ onMessagePressSend }) => {
  const [text, setText] = React.useState('');

  const handleInputTextChange = (event) => {
    setText(event.target.value);
  }

  const handleMessagePressSend = () => {
    const message = { text };
    onMessagePressSend?.(message);
    setText("");
  }

  return (
    <div className="input-chat-wrapper">
      <Input
        className="input-chat"
        placeholder="Enter you message here."
        value={text}
        onChange={handleInputTextChange}
        onPressEnter={handleMessagePressSend}
      >
      </Input>
    </div>
  )
}
export default InputChat;

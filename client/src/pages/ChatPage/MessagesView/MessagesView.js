import React from "react";
//others
import "./style.css";

const MessagesView = ({ conversation }) => {
  /** @type {any[]} */
  const messages = React.useMemo(() => conversation?.messages, [conversation])

  return (
    <div className="message-form-wrapper">{JSON.stringify(messages?.map(m => m.text))}</div>
  )
};
export default MessagesView;

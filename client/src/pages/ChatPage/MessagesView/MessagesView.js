import Text from "antd/lib/typography/Text";
import React from "react";
import { useAuth } from "../../../contexts/authenticationContext";
//others
import "./style.css";

const MessagesView = ({ conversation }) => {
  const { signedInUser } = useAuth();

  /** @type {any[]} */
  const messages = React.useMemo(() => conversation?.messages, [conversation])

  const isMyMessage = (message) => {
    return message?.senderId === signedInUser?._id
  }

  return (
    <div className="message-form-wrapper">
      {messages?.map((msg, i) =>
        <div key={i}>
          {isMyMessage(msg) ?
            <Text strong>{msg.text}</Text>
            :
            <Text>{msg.text}</Text>
          }
          <br />
        </div>
      )}

    </div>
  )
};
export default MessagesView;

import "./index.css";
// libs
import React from "react";
// component
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader/MessageHeader";
import InputChat from "./InputChat/InputChat";
import ListConversations from "./ListConversations/ListConversations";
import { Navbar } from "../../components";
import { getConversationById, getConversations } from "../../services/api/conversation";
import { useHistory, useParams } from "react-router";
import { message } from "antd";

const ChatPage = () => {
  /** @type {[any[],React.Dispatch<any[]>]} */
  const [conversations, setConversations] = React.useState(null);

  const [currentConversation, setCurrentConversation] = React.useState(null);
  const { conversationId } = useParams();
  const history = useHistory();

  React.useEffect(() => {
    getConversations()
      .then(res => {
        setConversations(res.data);
        console.log(res.data);
      })
  }, [])

  React.useEffect(() => {
    if (conversationId)
      getConversationById(conversationId)
      .then(({data}) => {
        setCurrentConversation(data);
        console.log(data);
      })
      .catch(error => {
        message.error('Failed to load conversation.', undefined, () => history.replace('/chat'));
      })
  }, [conversationId])

  return <div className="chat-wrapper">
    <Navbar />
    <ListConversations />
    <MessageHeader />
    <MessageForm />
    <InputChat />
  </div>
}
export default ChatPage;

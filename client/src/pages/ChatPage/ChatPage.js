import "./index.css";
// libs
import React from "react";
// component
import MessageForm from "./MessageForm/MessageForm";
import MessageHeader from "./MessageHeader/MessageHeader";
import InputChat from "./InputChat/InputChat";
import ListConversations from "./ListConversations/ListConversations";
import { Navbar } from "../../components";
import { getConversationById, getConversations } from "../../services/api/conversation";
import { useHistory, useParams } from "react-router";
import { message } from "antd";
import DivManageConversations from "./DivManageConversations/DivManageConversations";
import { useMessage } from '../../hooks/useMessage'
import { useCuteClientIO } from "../../socket/CuteClientIOProvider";

const ChatPage = () => {
  /** @type {[any[],React.Dispatch<any[]>]} */
  const [conversations, setConversations] = React.useState(null);
  const msgIO = useMessage();
  const cuteClientIO = useCuteClientIO();

  const [currentConversation, setCurrentConversation] = React.useState(null);
  const { conversationId } = useParams();
  const history = useHistory();

  const fetchConversations = () => {
    getConversations()
      .then(res => {
        setConversations(res.data);
      })
  };

  const fetchCurrentConversation = () => {
    if (conversationId)
      getConversationById(conversationId)
        .then(({ data }) => {
          setCurrentConversation(data);
        })
        .catch(error => {
          message.error('Failed to load conversation.', undefined, () => history.replace('/chat'));
        })
  }

  React.useEffect(() => {
    fetchConversations();
  }, [])

  React.useEffect(() => {
    fetchCurrentConversation();
  }, [conversationId])

  React.useEffect(() => {
    msgIO.onReceive(msg => {
      if (msg.status.code === 200) {
        fetchConversations();
        fetchCurrentConversation();
      }
    });

    msgIO.onSent((msg) => {
      if (msg.status.code === 200) {
        fetchConversations();
        fetchCurrentConversation();
      }
    })

    return msgIO.cleanUpAll;
  }, [msgIO.cuteIO.socketId])


  const onMessagePressSend = (message) => {
    if (conversationId)
      msgIO.send(conversationId, message);
  }

  const handleConversationClick = React.useCallback(conversation => {
    const { id } = conversation ?? {};

    if ((id) && id !== conversationId)
      history.push(`/chat/${id}`);
  }, [conversationId]);

  return <div className="chat-wrapper">
    <Navbar />
    <DivManageConversations />
    <ListConversations
      conversations={conversations}
      onConversationClick={handleConversationClick}
    />
    <MessageHeader />
    <MessageForm />
    <InputChat
      onMessagePressSend={onMessagePressSend}
    />
  </div>
}
export default ChatPage;

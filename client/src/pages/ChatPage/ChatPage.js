import "./index.css";
// libs
import React from "react";
// component
import MessagesView from "./MessagesView/MessagesView";
import MessageHeader from "./MessageHeader/MessageHeader";
import InputChat from "./InputChat/InputChat";
import ListConversations from "./ListConversations/ListConversations";
import { Navbar } from "../../components";
import * as conversationApis from "../../services/api/conversation";
import { useHistory, useParams } from "react-router";
import { message } from "antd";
import DivManageConversations from "./DivManageConversations/DivManageConversations";
import { useMessage } from '../../hooks/useMessage'
import { useCuteClientIO } from "../../socket/CuteClientIOProvider";
import { ConversationService } from "../../services/ConversationService";
import { useAuth } from "../../contexts/authenticationContext";

const ChatPage = () => {
  /** @type {[any[],React.Dispatch<any[]>]} */
  const [conversations, setConversations] = React.useState(null);
  const { signedInUser } = useAuth();
  const msgIO = useMessage();

  const [currentConversation, setCurrentConversation] = React.useState(null);
  const currentConversationMemberInfo = React.useMemo(() => ConversationService.getMemberInfo(currentConversation, signedInUser?._id), [currentConversation, signedInUser?._id]);
  const { conversationId } = useParams();
  const history = useHistory();
  const disabledAutoSeen = React.useRef(false);

  const fetchConversations = () => {
    conversationApis.getConversations()
      .then(res => {
        setConversations(res.data);
      })
  };

  const fetchConversationById = (conversationId) => {
    if (conversationId)
      conversationApis.getConversationById(conversationId)
        .then(({ data }) => {
          setCurrentConversation(data);
        })
        .catch(error => {
          message.error('Failed to load conversation.', undefined, () => history.replace('/chat'));
        })
    else
      setCurrentConversation(null);
  }

  React.useEffect(() => {
    fetchConversations();
  }, [])

  React.useEffect(() => {
    fetchConversationById(conversationId);
  }, [conversationId])

  React.useEffect(() => {
    msgIO.onReceive(msg => {
      if (msg.status.code === 200) {
        fetchConversations();
        fetchConversationById(conversationId);
      }
    });

    msgIO.onSent((msg) => {
      if (msg.status.code === 200) {
        fetchConversations();
        fetchConversationById(conversationId);
      }
    })

    msgIO.onConversationsUpdated((msg) => {
      fetchConversations();
      fetchConversationById(conversationId);
    })

    disabledAutoSeen.current = false;
    return msgIO.cleanUpAll;
  }, [conversationId])

  React.useEffect(() => {
    // Set member as seen
    if (conversationId && !currentConversationMemberInfo?.hasSeen && !disabledAutoSeen.current)
      conversationApis.updateConversationMySeenState(conversationId, true);
  }, [currentConversation, conversationId])

  const toggleCurrentConversationSeenState = () => {
    if(currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMySeenState(conversationId, !currentConversationMemberInfo.hasSeen);
      disabledAutoSeen.current = true;
    }
  }

  const toggleCurrentConversationMutedState = () => {
    if(currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMyMutedState(conversationId, !currentConversationMemberInfo.hasMuted);
    }
  }

  const toggleCurrentConversationBlockedState = () => {
    if(currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMyBlockedState(conversationId, !currentConversationMemberInfo.hasBlocked);
    }
  }


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
    <MessageHeader
      conversation={currentConversation}
      toggleSeenState={toggleCurrentConversationSeenState}
      toggleMutedState={toggleCurrentConversationMutedState}
      toggleBlockedState={toggleCurrentConversationBlockedState}
    />
    <MessagesView
      conversation={currentConversation}
    />
    <InputChat
      onMessagePressSend={onMessagePressSend}
    />
  </div>
}
export default ChatPage;

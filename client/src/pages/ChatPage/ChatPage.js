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
import { message, Modal } from "antd";
import DivManageConversations from "./DivManageConversations/DivManageConversations";
import { useMessage } from '../../hooks/useMessage'
import { useCuteClientIO } from "../../socket/CuteClientIOProvider";
import { ConversationService } from "../../services/ConversationService";
import { useAuth } from "../../contexts/authenticationContext";
import ConversationSettingModal from "./ConversationSettingModal/ConversationSettingModal";

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

  const [conversationToEdit, setConversationToEdit] = React.useState(null);
  const [conversationSettingModalVisible, setConversationSettingModalVisible] = React.useState(false);

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

    msgIO.onFailed((msg) => {
      message.error({
        content: "Oops! We can't deliver this message at the moment. Please try again later."
      })
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

  //#region Conversation actions
  const toggleCurrentConversationSeenState = () => {
    if (currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMySeenState(conversationId, !currentConversationMemberInfo.hasSeen);
      disabledAutoSeen.current = true;
    }
  }

  const toggleCurrentConversationMutedState = () => {
    if (currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMyMutedState(conversationId, !currentConversationMemberInfo.hasMuted);
    }
  }

  const toggleCurrentConversationBlockedState = () => {
    if (currentConversationMemberInfo && conversationId) {
      conversationApis.updateConversationMyBlockedState(conversationId, !currentConversationMemberInfo.hasBlocked);
    }
  }

  const leaveGroupConversation = () => {
    if (currentConversationMemberInfo && conversationId) {
      if (currentConversation?.members?.some(member => member.role === "admin" && member.memberId !== signedInUser?._id))
        Modal.confirm({
          title: "Leave group",
          content: "Are you sure to leave this group?",
          onOk: () => {
            conversationApis.leaveConversation(conversationId)
              .catch(() => {
                history.replace('/chat')
              })
          }
        })
      else
        message.error("Please assign another person as admin before leaving.");
    }
  }
  //#endregion

  //#region Modal conversation setting
  const showAddConversationModal = () => {
    setConversationToEdit(null);
    setConversationSettingModalVisible(true);
  }

  const showConversationSettingToUpdate = () => {
    setConversationToEdit(currentConversation);
    setConversationSettingModalVisible(true);
  }

  const hideConversationSetting = () => {
    setConversationToEdit(null);
    setConversationSettingModalVisible(false);
  }

  const handleConversationModalSettingSubmit = (data, isCreating) => {
    if (isCreating) {
      data.type = "group";

      conversationApis.createConversationThenSetRoles(data)
        .catch(() => { message.error({ content: "Something went wrong." }) })
    }
    else {
      conversationApis.updateConversation(data._id, data)
        .catch(() => { message.error({ content: "Something went wrong." }) })

      if (data.type === "group")
        conversationApis.setMembersThenRoleInConversation(data._id, data.members)
          .catch(() => { message.error({ content: "Something went wrong." }) })
    }

    hideConversationSetting();
  }

  const handleConversationModalSettingCancel = () => {
    hideConversationSetting();
  }
  //#endregion

  const handleMessagePressSend = (message) => {
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
    <DivManageConversations
      onCreateConversationClick={showAddConversationModal}
    />
    <ListConversations
      conversations={conversations}
      onConversationClick={handleConversationClick}
    />
    <MessageHeader
      conversation={currentConversation}
      toggleSeenState={toggleCurrentConversationSeenState}
      toggleMutedState={toggleCurrentConversationMutedState}
      toggleBlockedState={toggleCurrentConversationBlockedState}
      leaveGroupConversation={leaveGroupConversation}
      showConversationSetting={showConversationSettingToUpdate}
    />
    <MessagesView
      conversation={currentConversation}
    />
    <InputChat
      onMessagePressSend={handleMessagePressSend}
    />

    <ConversationSettingModal
      visible={conversationSettingModalVisible}
      onCancel={handleConversationModalSettingCancel}
      onSubmit={handleConversationModalSettingSubmit}
      conversation={conversationToEdit}
    />
  </div>
}
export default ChatPage;

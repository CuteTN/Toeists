import React from "react";
import { Modal, Form, Input, Radio } from "antd";
import ConversationMemberSettingRow from './ConversationMemberSettingRow'
import './index.css'

/**
 * 
 * @param {object} param0 
 * @param {(conversationData: object) => string} param0.onSubmit returns an error message if necessary
 * @returns 
 */
const ConversationSettingModal = ({ conversation, visible, onCancel, onSubmit }) => {
  const [conversationName, setConversationName] = React.useState("");

  React.useEffect(() => {
    setConversationData(visible ? conversation : null);
  }, [visible, conversation])

  const setConversationData = (conversation) => {
    setConversationName(conversation?.name);
  }

  const handleOk = () => {
    const conversationData = {
      _id: conversation._id,
      name: conversationName,
      type: conversation ? conversation.type : "group"
    }

    onSubmit?.(conversationData, Boolean(!conversation));
  }

  const basicInformationSection = () => {
    return (
      <div>
        <h1 className="ml-1 form-label">Basic information:</h1>

        <label className="ml-3 form-label">Name:</label>
        <Input
          title="Conversation name"
          placeholder="Enter a conversation name."
          value={conversationName}
          onChange={(event) => setConversationName(event.target.value)}
        />
      </div>
    )
  }

  const memberListSection = () => {
    return (
      <div>
        <hr className="mt-4" />

        <h1 className="ml-1 form-label">Members list:</h1>
        {conversation?.members.map((member, i) =>
          <ConversationMemberSettingRow member={member} key={i}/>
        )}
      </div>
    )
  }

  return (
    <Modal
      visible={visible}
      title={conversation ? "Conversation setting" : "Create a new conversation"}
      okText="Submit"
      onCancel={onCancel}
      onOk={handleOk}
    >
      {basicInformationSection()}
      {memberListSection(conversation)}
    </Modal>
  );
};

export default ConversationSettingModal;

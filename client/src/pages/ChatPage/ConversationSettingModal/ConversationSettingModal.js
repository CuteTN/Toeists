import React from "react";
import { Modal, Form, Input, Radio } from "antd";

/**
 * 
 * @param {object} param0 
 * @param {(conversationData: object) => string} param0.onSubmit returns an error message if necessary
 * @returns 
 */
const ConversationSettingModal = ({ conversation, visible, onCancel, onSubmit }) => {
  const [conversationName, setConversationName] = React.useState("");

  React.useEffect(() => {
    setConversationData(visible? conversation : null);
  }, [visible, conversation])

  const setConversationData = (conversation) => {
    setConversationName(conversation?.name);
  }

  const handleOk = () => {
    const conversationData = {
      _id: conversation._id,
      name: conversationName,
      type: conversation? conversation.type : "group"
    }

    onSubmit?.(conversationData, Boolean(!conversation));
  }

  return (
    <Modal
      visible={visible}
      title={conversation? "Conversation setting" : "Create a new conversation"}
      okText="Submit"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Input 
        title="Conversation name" 
        placeholder="Enter a conversation name."
        value={conversationName}
        onChange={(event) => setConversationName(event.target.value)}
      />
    </Modal>
  );
};

// const ModalForm = Form.create({ name: "modal_form" })(ConversationSettingModal);

export default ConversationSettingModal;

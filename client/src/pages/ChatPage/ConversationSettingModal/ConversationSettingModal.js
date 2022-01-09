import React, { useMemo, useState } from "react";
import { Modal, Input, Select, message } from "antd";
import ConversationMemberSettingRow from "./ConversationMemberSettingRow";
import "./style.css";
import { ConversationService } from "../../../services/ConversationService";
import { useAuth } from "../../../contexts/authenticationContext";
import { getAllUsers } from "../../../services/api/user";

/**
 *
 * @param {object} param0
 * @param {(conversationData: object) => string} param0.onSubmit returns an error message if necessary
 * @returns
 */

const { Option } = Select;
const ConversationSettingModal = ({
  conversation,
  visible,
  onCancel,
  onSubmit,
}) => {
  const { signedInUser } = useAuth();

  const [conversationName, setConversationName] = React.useState("");
  const [conversationMembers, setConversationMembers] = React.useState([]);

  const [listUsers, setListUsers] = useState([]);

  const currentMemberInfo = React.useMemo(
    () => ConversationService.getMemberInfo(conversation, signedInUser?._id),
    [conversation, signedInUser?._id]
  );

  const notMemberUsers = useMemo(() => {
    if (!(listUsers && conversationMembers))
      return [];
    return listUsers.filter(user => !conversationMembers.find(member => member.memberId === user._id));
  }, [listUsers, conversationMembers])

  React.useEffect(() => {
    setConversationData(visible ? conversation : null);
  }, [visible, conversation?._id], signedInUser?._id);

  React.useEffect(() => {
    getAllUsers().then(res => {
      const users = res.data;
      setListUsers(users);
    });
  }, []);

  const setConversationData = (conversation) => {
    setConversationName(conversation?.name);

    if (conversation)
      setConversationMembers(deepCloneConversationMembers(conversation?.members) ?? [])
    else
      setConversationMembers([
        {
          memberId: signedInUser?._id,
          member: signedInUser,
          role: 'admin',
        }
      ])
  };

  const deepCloneConversationMembers = (original) => {
    return original?.map(member => ({
      memberId: member.memberId,
      member: member.member,
      role: member.role,
    }))
  };

  const handleRemoveMember = (memberId) => {
    setConversationMembers(prev => prev.filter(member => member.memberId !== memberId))
  };

  const handleSetMemberRole = (memberId, newRole) => {
    setConversationMembers(prev => prev.map(member => {
      const result = { ...member };
      if (memberId === member.memberId)
        result.role = newRole;
      return result;
    }))
  };

  const filterUsers = (input, option) => {
    input = input?.toLowerCase() ?? "";
    return option.title?.toLowerCase()?.includes(input);
  }

  const handleSelectNewMember = (value, options) => {
    if (!value)
      return;

    setConversationMembers(prev => {
      if (!prev.find(member => member.memberId === value)) {
        const newMember = {
          memberId: value,
          member: listUsers.find(user => user._id === value),
          role: "none"
        }
        return [...prev, newMember]
      }
      else
        return [...prev]
    })
  };

  const handleOk = () => {
    const conversationData = {
      _id: conversation?._id,
      name: conversationName,
      type: conversation ? conversation.type : "group",
      members: conversationMembers,
    };

    if (conversationData.type === "group") {
      if (!conversationData.name) {
        message.error({ content: "A group conversation must have a name.", })
        return;
      }

      if (!conversationData.members.some(member => member.role === "admin")) {
        message.error({ content: "A group must have at least one admin.", })
        return;
      }
    }

    onSubmit?.(conversationData, Boolean(!conversation));
  };

  const BasicInformationSection = () => {
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
    );
  };

  const AddMemberSection = () => {
    return (
      <div>
        <hr className="mt-4" />
        <h1 className="ml-1 form-label">Add Member</h1>
        <Select
          showSearch
          placeholder="Add member"
          allowClear
          value={null}
          style={{ width: "100%" }}
          filterOption={filterUsers}
          onSelect={handleSelectNewMember}
        >
          {notMemberUsers?.map((item) => (
            <Option key={item._id} value={item._id} title={`${item.name} (${item.username})`}>{`${item.name} (${item.username})`}</Option>
          ))}
        </Select>
      </div>
    );
  };

  const MemberListSection = () => {
    return (
      <div>
        <hr className="mt-4" />

        <h1 className="ml-1 form-label">Members list:</h1>
        {conversationMembers?.map((member, i) => (
          <ConversationMemberSettingRow
            member={member}
            key={i}
            conversationType={conversation ? conversation.type : "group"}
            currentUserRole={conversation ? currentMemberInfo?.role : "admin"}
            onRemoveMember={handleRemoveMember}
            onSetRole={handleSetMemberRole}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      visible={visible}
      title={
        conversation ? "Conversation setting" : "Create a new conversation"
      }
      okText="Submit"
      onCancel={onCancel}
      onOk={handleOk}
    >
      {BasicInformationSection()}
      {(
        (conversation?.type === "group" && currentMemberInfo.role === "admin") || // is admin
        !conversation                                                             // is creating new conversation
      ) &&
        AddMemberSection()
      }
      {MemberListSection(conversation)}
    </Modal>
  );
};

export default ConversationSettingModal;

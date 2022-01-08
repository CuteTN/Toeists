import { Dropdown, Menu, Row, Typography, Card } from "antd";
import React from "react";
import { ConversationService } from "../../../services/ConversationService";
import {
  EllipsisOutlined,
  EyeOutlined,
  BellOutlined,
  StopOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

import "./style.css";
import COLOR from "../../../constants/colors";
import { useAuth } from "../../../contexts/authenticationContext";
import ConversationAvatar from "../ConversationAvatar/ConversationAvatar";

const MessageHeader = ({
  conversation,
  toggleSeenState,
  toggleMutedState,
  toggleBlockedState,
  showConversationSetting,
}) => {
  const { signedInUser } = useAuth();
  const conversationDisplayName = React.useMemo(
    () => ConversationService.getName(conversation),
    [conversation]
  );
  const currentMemberInfo = React.useMemo(
    () => ConversationService.getMemberInfo(conversation, signedInUser?._id),
    [conversation, signedInUser?._id]
  );

  const menuMore = () => {
    const { hasSeen, hasMuted, hasBlocked } = currentMemberInfo ?? {};

    return (
      <Menu disabled={currentMemberInfo == null}>
        <Menu.Item key="setting" onClick={showConversationSetting}>
          <Row align="middle">
            <SettingOutlined />
            <Text className="ml-2">Setting</Text>
          </Row>
        </Menu.Item>

        <Menu.Item key="seen" onClick={toggleSeenState}>
          <Row align="middle">
            <EyeOutlined />
            <Text className="ml-2">Mark as {hasSeen ? "unseen" : "seen"}</Text>
          </Row>
        </Menu.Item>

        <Menu.Item key="muted" onClick={toggleMutedState} disabled={hasBlocked}>
          <Row align="middle">
            <BellOutlined />
            <Text className="ml-2">{hasMuted ? "Unmute" : "Mute"}</Text>
          </Row>
        </Menu.Item>

        {conversation?.type === "private" && (
          <Menu.Item key="blocked" onClick={toggleBlockedState}>
            <Row align="middle">
              <StopOutlined />
              <Text className="ml-2">{hasBlocked ? "Unblock" : "Block"}</Text>
            </Row>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  return (
    <div className="message-header-wrapper">
      <Row className="message-title mt-4">
        <ConversationAvatar conversation={conversation} avatarSize={40} maxAvatarCount={3}/>
        <h2 className="ml-2">
          <font color="orange"> {conversationDisplayName} </font>{" "}
        </h2>
      </Row>

      <div className="message-setting">
        <Dropdown
          overlay={menuMore}
          trigger={["click"]}
          placement="bottomRight"
        >
          <EllipsisOutlined
            style={{
              fontSize: 24,
              color: COLOR.black,
              marginTop: 20,
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
};
export default MessageHeader;

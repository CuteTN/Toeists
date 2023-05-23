import { Card, Badge, Avatar } from "antd";
import React from "react";
import { useAuth } from "../../../contexts/authenticationContext";
import { ConversationService } from "../../../services/ConversationService";
import logo from "../../../assets/add-user.png";
import "./style.css";
import ConversationAvatar from "../ConversationAvatar/ConversationAvatar";

export const ConversationCard = ({ conversation, onClick }) => {
  const { signedInUser } = useAuth();
  const conversationDisplayName = React.useMemo(
    () => ConversationService.getName(conversation),
    [conversation]
  );
  const conversationLastMessage = React.useMemo(
    () => ConversationService.getLastMessage(conversation),
    [conversation]
  );
  const currentMemberInfo = React.useMemo(
    () => ConversationService.getMemberInfo(conversation, signedInUser?._id),
    [conversation, signedInUser?._id]
  );

  return conversation?.id ? (
    <Card
      className={
        currentMemberInfo?.hasSeen
          ? "conversation-card-seen"
          : "conversation-card-not-seen"
      }
      style={{ backgroundColor: currentMemberInfo?.hasSeen? "white":"#ffdcb0"}}
      onClick={() => onClick(conversation)}
    >
      <div className="conversation-card">
        <Badge color="green">
          {/* <Avatar
            className="message-ava"
            style={{ marginLeft: -5 }}
            size={50}
            src="https://res.klook.com/image/upload/v1596021224/blog/a5nzbvlpm0gfyniy6s7r.jpg"
          /> */}
          <ConversationAvatar conversation={conversation} avatarSize={50} maxAvatarCount={1}/>
        </Badge>
        <div className="message-card">
          <h5 className="message-card-name"> {conversationDisplayName} </h5>
          <h6 className="message-card-last-message">
            {conversationLastMessage?.text}{" "}
          </h6>
        </div>
      </div>
    </Card>
  ) : (
    <></>
  );
};

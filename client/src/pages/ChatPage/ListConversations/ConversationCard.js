import { Card } from 'antd'
import React from 'react'
import { useAuth } from '../../../contexts/authenticationContext'
import { ConversationService } from '../../../services/ConversationService'
import './style.css'

export const ConversationCard = ({ conversation, onClick }) => {
  const { signedInUser } = useAuth();
  const conversationDisplayName = React.useMemo(() => ConversationService.getName(conversation), [conversation]);
  const conversationLastMessage = React.useMemo(() => ConversationService.getLastMessage(conversation), [conversation]);
  const currentMemberInfo = React.useMemo(() => ConversationService.getMemberInfo(conversation, signedInUser?._id), [conversation, signedInUser?._id]);

  return conversation?.id ? (
    <Card
      className={["conversation-card", currentMemberInfo?.hasSeen ? "conversation-card-seen" : "conversation-card-not-seen"]}
      onClick={() => onClick(conversation)}
    >
      <b className='message-card-name'> {conversationDisplayName} </b>
      <p className='message-card-last-message'> {conversationLastMessage?.text} </p>
    </Card>
  )
    :
    <></>
}
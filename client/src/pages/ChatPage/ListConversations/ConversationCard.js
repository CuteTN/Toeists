import { Card } from 'antd'
import React from 'react'
import { ConversationService } from '../../../services/ConversationService'
import './style.css'

export const ConversationCard = ({ conversation, onClick }) => {
  const conversationDisplayName = React.useMemo(() => ConversationService.getName(conversation), [conversation])

  return conversation?.id ? (
    <Card
      className="conversation-card"
      onClick={() => onClick(conversation)}
    >
      <b> {conversationDisplayName} </b>
    </Card>
  )
    :
    <></>
}
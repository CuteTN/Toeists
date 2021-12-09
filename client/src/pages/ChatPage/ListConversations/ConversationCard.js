import { Card } from 'antd'
import React from 'react'
import './style.css'

export const ConversationCard = ({ conversation, onClick }) => {
  return conversation?.id ? (
    <Card
      className="conversation-card"
      onClick={() => onClick(conversation)}
    >
      {conversation.id}
    </Card>
  )
    :
  <></>
}
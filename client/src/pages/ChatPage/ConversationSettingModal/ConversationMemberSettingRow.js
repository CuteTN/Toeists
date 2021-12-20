import React from 'react';

const ConversationMemberSettingRow = ({ member }) => {
  return (
    <div className='row'>
      { JSON.stringify(member?.member?.username) } 
    </div>
  )
}

export default ConversationMemberSettingRow;
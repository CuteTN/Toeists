import { Avatar, Tooltip } from 'antd';
import React from 'react';
import { GoPerson, FaLock } from 'react-icons/all'
import { useHistory } from 'react-router-dom';
import COLOR from '../../../constants/colors';
import { ConversationService } from '../../../services/ConversationService';

const ConversationAvatar = ({ conversation, avatarSize, maxAvatarCount }) => {
  const otherMembers = React.useMemo(() => ConversationService.getOtherMembers(conversation), [conversation]);
  const history = useHistory();

  const navigateToUserPage = (user) => {
    if (user?._id)
      history.push(`/userinfo/${user._id}`)
  }

  const handleUserAvatarClick = (event, user) => {
    navigateToUserPage(user);
    event.stopPropagation();
    event.preventDefault();
  }

  const OnlyMeGroupAvatar = () => {
    return (
      <Tooltip title="Only me">
        <Avatar size={avatarSize}>
          <GoPerson />
        </Avatar>
      </Tooltip>
    )
  }

  const CrowdedGroupAvatar = () => {
    return (
      <Avatar.Group maxCount={maxAvatarCount} size={avatarSize}>
        {otherMembers.map((member, i) =>
          <Tooltip key={i} title={`${member?.member?.name} (${member?.member?.username})`}>
            <div onClick={e => handleUserAvatarClick(e, member?.member)}>
              <Avatar
                src={member?.member?.avatarUrl}
                size={avatarSize}
                style={{ cursor: "pointer" }}
              >
                {member?.member?.username}
              </Avatar>
            </div>
          </Tooltip>
        )}
      </Avatar.Group>
    )
  }

  const PrivateConversationAvatar = () => {
    const member = otherMembers?.[0];

    return (
      <Tooltip title={`${member?.member?.name} (${member?.member?.username})`}>
        <div onClick={e => handleUserAvatarClick(e, member?.member)}>
          <Avatar
            src={member?.member?.avatarUrl}
            size={avatarSize}
            style={{
              borderColor: COLOR.orange,
              borderStyle: "solid",
              cursor: "pointer" 
            }}
          >
            {member?.member?.username}
          </Avatar>
        </div>
      </Tooltip>
    )
  }

  // return conversation?.type === "group" ?
  return conversation?.type === "group" ?
    (
      <div>
        {(otherMembers?.length === 0 ?
          OnlyMeGroupAvatar()
          :
          CrowdedGroupAvatar()
        )}
      </div>
    )
    :
    (
      PrivateConversationAvatar()
    )
}

export default ConversationAvatar
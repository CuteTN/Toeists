import { Button, Card, Dropdown, Menu, Row, Space, Typography } from 'antd';
import {
  CrownTwoTone,
  EllipsisOutlined,
} from "@ant-design/icons";
import React from 'react';
import './style.css'
import { useAuth } from '../../../contexts/authenticationContext'
import COLOR from '../../../constants/colors';

const { Text } = Typography;

const ConversationMemberSettingRow = ({
  member,
  conversationType,
  currentUserRole,
  onSetNickname,
  onSetRole,
  onRemoveMember,
}) => {
  const { signedInUser } = useAuth();

  const username = React.useMemo(() => member?.member?.username, [member]);
  const nickname = React.useMemo(() => member?.nickname, [member]);
  /** @type {"none"|"admin"} */
  const role = React.useMemo(() => conversationType === "group" ? member?.role : "none", [member]);
  const isCurrentUser = React.useMemo(() => member?.memberId === signedInUser._id);

  const isGroupAdmin = React.useMemo(() => conversationType === "group" && currentUserRole === "admin", [conversationType, currentUserRole]);

  const menuMore = () => {
    return (
      <Menu disabled={member == null}>
        {(isGroupAdmin && !isCurrentUser) &&
          <Menu.Item key="remove" onClick={() => onRemoveMember?.(member?.id)}>
            <Row align="middle">
              <Text className="ml-2">Remove member</Text>
            </Row>
          </Menu.Item>
        }

        {isGroupAdmin &&
          <Menu.Item key="set-role" onClick={() => onSetRole?.(member?.id, role === "admin"? "none" : "admin")}>
            <Row align="middle">
              <Text className="ml-2">
                {role === "admin" ?
                  "Remove from admins."
                  :
                  "Promote to admin."
                }
              </Text>
            </Row>
          </Menu.Item>
        }
      </Menu>
    )
  }

  return (
    <div className='container member-setting-row-wrapper'>
      <Card
        className='container flex-row member-setting-row-card'
        bodyStyle={{ padding: 10 }}
        hoverable={true}
      >
        <Text className='ml-2 mr-1' strong={isCurrentUser}>
          {username}
        </Text>
        {(nickname) &&
          <Text>
            ({nickname})
          </Text>
        }

        <div>
          <Menu theme="dark" mode="horizontal">
            <Dropdown
              overlay={menuMore}
              trigger={["click"]}
              placement="bottomRight"
            >
              <EllipsisOutlined
                style={{
                  fontSize: 24,
                  color: COLOR.white,
                  marginTop: 20,
                }}
              />
            </Dropdown>
          </Menu>
        </div>

        {/* <CrownTwoTone twoToneColor={role === "admin" ? "#ffa008" : "#2b2b2b"} /> */}

      </Card>
    </div>
  )
}

export default ConversationMemberSettingRow;
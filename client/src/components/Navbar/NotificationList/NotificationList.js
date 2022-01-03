import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Typography, Menu, Tooltip, Tabs, Button, Avatar, Dropdown, Row } from "antd";
import moment from "moment";
import COLOR from "../../../constants/colors";
import * as api from "../../../services/api/notification"
import { limitNameLength } from "../../../utils/limitNameLength";
import { FiMoreHorizontal, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineClear, VscCheckAll, VscFilter, BsTrash } from 'react-icons/all'
import { useHistory } from "react-router-dom";

const { Text } = Typography;
// const { TabPane } = Tabs;

function NotificationList({ notifications }) {
  const [enableShowUnseenOnly, setEnableShowUnseenOnly] = React.useState(true);
  const history = useHistory();

  const notificationsToShow = React.useMemo(() => {
    if (enableShowUnseenOnly)
      return notifications?.filter(noti => !noti.isSeen);
    return notifications;
  }, [enableShowUnseenOnly, notifications]);

  //#region Notifications actions
  const handleToggleFilterUnseenNotificationsClick = () => {
    setEnableShowUnseenOnly(prev => !prev)
  }

  const handleMarkAllNotificationsAsSeenClick = () => {
    api.setAllNotificationsAsSeen();
  };

  const handleClearSeenNotificationsClick = () => {
    api.clearAllSeenNotifications();
  };
  //#endregion
  
  //#region Notification actions
  const handleToggleNotificationSeenState = (noti) => {
    api.setNotificationSeenState(noti?._id, !noti?.isSeen);
  }

  const handleRemoveNotificationsClick = (noti) => {
    api.deleteNotification(noti?._id);
  }
  
  const handleNotificationItemClick = (noti) => {
    history.push(noti?.url);
    api.setNotificationSeenState(noti?._id, true);
  };
  //#endregion

  const MenuNotificationsActions = () => (
    <Menu>
      <Menu.Item key="filterUnseen" onClick={handleToggleFilterUnseenNotificationsClick}>
        {enableShowUnseenOnly ?
          (
            <Row align="middle">
              <VscFilter size={20} className="mr-lg-2" />
              <Text>Show all notifications</Text>
            </Row>
          )
          :
          (
            <Row align="middle">
              <VscFilter size={20} className="mr-lg-2" />
              <Text>Show unseen notifications only</Text>
            </Row>
          )
        }
      </Menu.Item>

      <Menu.Item key="markAllSeen" onClick={handleMarkAllNotificationsAsSeenClick}>
        <Row align="middle">
          <VscCheckAll size={20} className="mr-lg-2" />
          <Text>Mark all as seen</Text>
        </Row>
      </Menu.Item>

      <Menu.Item key="clearSeenNoti" onClick={handleClearSeenNotificationsClick}>
        <Row align="middle">
          <AiOutlineClear size={20} className="mr-lg-2" />
          <Text>Clear all seen notifications</Text>
        </Row>
      </Menu.Item>
    </Menu>
  );

  const MenuNotificationActions = (notification) => (
    <Menu>
      <Menu.Item key="setSeen" onClick={() => {handleToggleNotificationSeenState(notification)}}>
        {notification?.isSeen ?
          (
            <Row align="middle">
              <AiOutlineEyeInvisible size={20} className="mr-lg-2" />
              <Text>Mark this notification as unseen</Text>
            </Row>
          )
          :
          (
            <Row align="middle">
              <AiOutlineEye size={20} className="mr-lg-2" />
              <Text>Mark this notification as seen</Text>
            </Row>
          )
        }
      </Menu.Item>

      <Menu.Item key="removeNoti" onClick={() => handleRemoveNotificationsClick(notification)}>
        <Row align="middle">
          <BsTrash size={20} className="mr-lg-2" />
          <Text>Remove this notification</Text>
        </Row>
      </Menu.Item>
    </Menu>
  )

  return (
    <Menu>
      <div className="row" style={{ minWidth: 200 }}>
        <div className="col-10 text-left pl-4">
          <Text strong style={{ fontSize: 30 }}>Notifications</Text>
        </div>

        <div className="col-2 p-2">
          <Dropdown
            overlay={MenuNotificationsActions()}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <FiMoreHorizontal size={30} cursor={"pointer"} click />
          </Dropdown>
        </div>
      </div>

      {notificationsToShow?.length === 0 ? (
        <Menu.Item key="no-data" className="whitegreen-button">
          <div className="justify-content-center align-items-center p-2 text-center" style={{ width: 300 }}>
            You are all up-to-date.
          </div>
        </Menu.Item>
      ) : (
        <>
          {notificationsToShow?.slice(0, 5).map((noti, i) => (
            <Menu.Item
              key={noti._id}
              className="whitegreen-button"
            >
              <div
                className="d-flex align-items-center p-2 w-100"
                style={{ backgroundColor: !noti?.isSeen && COLOR.pastelOrange }}
              >
                <div 
                  className="d-flex col-10 ml-1 flex-column"
                  onClick={() => handleNotificationItemClick(noti)}
                >
                  <Text strong>
                    {noti.title}
                  </Text>

                  <Tooltip title={noti.text} placement="bottom">
                    <Text>
                      {limitNameLength(noti.text, 54)}
                    </Text>
                  </Tooltip>

                  <Text type="secondary">
                    {moment(noti?.createdAt).fromNow()}
                  </Text>
                </div>

                <div className="d-flex col-2 ml-1 flex-column">
                  <Dropdown
                    overlay={MenuNotificationActions(noti)}
                    trigger={["hover"]}
                    placement="bottomCenter"
                  >
                    <FiMoreHorizontal size={30} cursor={"pointer"} click />
                  </Dropdown>
                </div>
              </div>
            </Menu.Item>
          ))}
        </>
      )}
    </Menu>
  );
}

export default NotificationList;

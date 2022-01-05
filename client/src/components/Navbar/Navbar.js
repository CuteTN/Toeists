import React, { useEffect, useRef, useMemo, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Input,
  Menu,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
  notification,
  Button,
} from "antd";
import styles from "./styles";
import logo from "../../assets/lightlogo.png";
import {
  SearchOutlined,
  BellFilled,
  EditFilled,
  MessageFilled,
  LogoutOutlined,
  LoginOutlined,
  EllipsisOutlined,
  SettingOutlined,
  RocketOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useMobile } from "../../utils/responsiveQuery";
import { useMediaQuery } from "react-responsive";
import { GrStatusGoodSmall } from "react-icons/gr";

import decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import COLOR from "../../constants/colors";
import { AuthenticationService } from "../../services/AuthenticationService";
import { useAuth } from "../../contexts/authenticationContext";
import { useCuteClientIO } from "../../socket/CuteClientIOProvider";
import { fetchNotifications } from "../../services/api/notification";
import { getConversations } from "../../services/api/conversation";
import { ConversationService } from "../../services/ConversationService";
import NotificationList from "./NotificationList/NotificationList";
import { GiArchiveResearch } from "react-icons/gi";
import { useDictionary } from "../DictionaryProvider/DictionaryProvider";

const { Header } = Layout;
const { Text } = Typography;

function Navbar() {
  const { signedInUser } = useAuth();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1042px)" }); // return true if right size
  const history = useHistory();
  const cuteIO = useCuteClientIO();
  const dictionary = useDictionary();

  const [notifications, setNotifications] = React.useState();
  const [conversations, setConversations] = React.useState();

  const numberOfUnseenNotifications = React.useMemo(() => {
    if (!(notifications && signedInUser))
      return null;

    let res = 0;
    notifications.forEach(noti => res += noti.isSeen ? 0 : 1);

    return res || null;
  }, [signedInUser, notifications])

  const numberOfUnseenConversations = React.useMemo(() => {
    if (!(conversations && signedInUser))
      return null

    let res = 0;
    conversations.forEach(conv => {
      const memInfo = ConversationService.getMemberInfo(conv, signedInUser?._id);
      res += memInfo.hasSeen ? 0 : 1;
    })

    return res || null;
  }, [signedInUser, conversations])

  React.useEffect(() => {
    fetchNotifications().then(res => {
      setNotifications(res.data);
    })
    getConversations().then(res => {
      setConversations(res.data);
    })

    const unsub = cuteIO.onReceiveAny((event, msg) => {
      if (event.startsWith("Notification-") || event === "System-NotificationsUpdate") {
        fetchNotifications().then(res => {
          setNotifications(res.data);
        })
      }

      if (event.startsWith("Message-")) {
        getConversations().then(res => {
          setConversations(res.data);
        })
      }
    })

    return unsub;
  }, [cuteIO])

  //#region Click handlers
  const handleForumClick = () => {
    history.push("/forum/create");
  };

  const handleFeedClick = () => {
    history.push("/feed");
  };

  const handleDictionaryClick = () => {
    dictionary.openDictionaryModal();
  }

  const handleMessageClick = () => {
    history.push("/chat");
  };

  const handleAvatarClick = () => {
    history.push(`/userinfo/${signedInUser?._id}`)
  }

  const handleSignOutClick = () => {
    AuthenticationService.signOut();
  };

  const handleSignInClick = () => {
    history.push("/signin");
  }

  const handleRegisterClick = () => {
    history.push("/signup");
  }

  const handleSettingsClick = () => {
    history.push("/settings");
  };
  //#endregion

  const MainMenuItems = () => {
    return (
      <Menu
        style={styles.orangeBackground}
        theme="dark"
        mode={(!isSmallScreen) ? "horizontal" : "vertical"}
      >
        <Menu.Item
          key="feed"
          className="navitem pickitem text-center"
          onClick={handleFeedClick}
        >
          <Tooltip title="News feed" placement="bottom">
            <GlobalOutlined style={{ fontSize: 24, color: COLOR.white }} />
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="dictionary"
          className="navitem pickitem text-center"
          onClick={handleDictionaryClick}
        >
          <Tooltip title="Show dictionary" placement="bottom">
            <GiArchiveResearch style={{ fontSize: 24, color: COLOR.white }} />
          </Tooltip>
        </Menu.Item>

        {signedInUser &&
          <Menu.Item
            key="forum"
            className="navitem pickitem text-center"
            onClick={handleForumClick}
          >
            <Tooltip title="Create a forum" placement="bottom">
              <EditFilled style={{ fontSize: 24, color: COLOR.white }} />
            </Tooltip>
          </Menu.Item>
        }

        {signedInUser &&
          <Menu.Item
            key="message"
            className="text-center navitem pickitem"
            onClick={handleMessageClick}
          >
            <Badge count={numberOfUnseenConversations}>
              <Tooltip title="Message" placement="bottom">
                <MessageFilled style={{ fontSize: 24, color: COLOR.white }} />
              </Tooltip>
            </Badge>
          </Menu.Item>
        }

        {signedInUser &&
          <Menu.Item
            key="noti"
            className="navitem notpickitem text-center"
          >
            <Dropdown
              overlay={NotificationList({
                notifications,
              })}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Badge count={numberOfUnseenNotifications} showZero>
                <Tooltip title="Notifications" placement="bottom">
                  <BellFilled
                    className="clickable"
                    style={{ fontSize: 24, color: COLOR.white }}
                  />
                </Tooltip>
              </Badge>
            </Dropdown>
          </Menu.Item>
        }

        {signedInUser &&
          <Menu.Item key="avatar" className="text-center navitem notpickitem">
            <Tooltip
              title={
                <div className="text-center">
                  <div>{signedInUser?.name ?? "Unknown"}</div>
                  <Dropdown
                    //   overlay={menuStatus}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Tooltip title="Status" placement="right">
                      <GrStatusGoodSmall
                        className="icon"
                        style={
                          {
                            // color: renderStatus(
                            //   friendsStatusManager.getStatus(currentUser?._id)
                            // ),
                          }
                        }
                      />
                    </Tooltip>
                  </Dropdown>
                </div>
              }
              placement="bottom"
            >
              <Avatar
                size="large"
                alt={signedInUser?.name}
                onClick={handleAvatarClick}
              >
                {signedInUser?.name}
              </Avatar>
            </Tooltip>
          </Menu.Item>
        }
      </Menu>
    );
  };

  const menuMore = (
    <Menu>
      {isSmallScreen && <MainMenuItems/>}

      {signedInUser &&
        <Menu.Item key="settings" onClick={() => handleSettingsClick()}>
          <Row align="middle">
            <SettingOutlined className="mr-lg-2" />
            <Text>Settings</Text>
          </Row>
        </Menu.Item>
      }

      {signedInUser &&
        <Menu.Item key="logout" onClick={handleSignOutClick}>
          <Row align="middle">
            <LogoutOutlined className=" red mr-lg-2" />
            <Text>Sign out</Text>
          </Row>
        </Menu.Item>
      }

      {(!signedInUser) &&
        <Menu.Item key="register" onClick={handleRegisterClick}>
          <Row align="middle">
            <RocketOutlined className="mr-lg-2" />
            <Text>Register</Text>
          </Row>
        </Menu.Item>
      }

      {(!signedInUser) &&
        <Menu.Item key="login" onClick={handleSignInClick}>
          <Row align="middle">
            <LoginOutlined className="mr-lg-2" />
            <Text>Sign in</Text>
          </Row>
        </Menu.Item>
      }

    </Menu>
  );

  return (
    <div className="header-wrapper">
      <Header
        style={{
          ...styles.orangeBackground,
          ...styles.fixedHeader,
        }}
      >
        <Row className="align-items-center justify-content-between">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: isSmallScreen ? "80%" : "50%" }}
          >
            <div style={styles.logo}>
              <Link to="/">
                <img src={logo} alt="Logo" height="58" className="mr-2" />
              </Link>
            </div>
            <Input
              // onPressEnter={handleSearch}
              allowClear
              suffix={
                <SearchOutlined style={{ fontSize: 24, color: COLOR.white }} />
              }
              // ref={inputRef}
              bordered={false}
              style={{ backgroundColor: COLOR.lightOrange }}
            // defaultValue={txtInitSearch}
            />
          </div>

          {/* {user ? ( */}
          <div className="d-flex">
            {(!isSmallScreen) && <MainMenuItems />}

            <Menu
              theme="dark"
              mode="horizontal"
              style={styles.orangeBackground}
            >
              <Dropdown
                overlay={menuMore}
                trigger={["click"]}
                placement="bottomCenter"
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
        </Row>
      </Header>
    </div>
  );
}

export default Navbar;

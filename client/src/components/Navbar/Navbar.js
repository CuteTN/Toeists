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
  EllipsisOutlined,
  SettingOutlined,
  PicLeftOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useMobile } from "../../utils/responsiveQuery";
import { useMediaQuery } from "react-responsive";
import { GrStatusGoodSmall } from "react-icons/gr";

import decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../redux/actions/auth";
import COLOR from "../../constants/colors";
// import { useLocalStorage } from "../../hooks/useLocalStorage";
// import { useToken } from "../../context/TokenContext";
// import { useCuteClientIO } from "../../socket/CuteClientIOProvider";

// import {
//   addUserNotifications,
//   refreshNotifications,
//   setSeenNotification,
//   getUserNotifications,
// } from "../../redux/actions/notifications";
// import * as apiConversation from "../../api/conversation";
// import NotificationList from "./NotificationList/NotificationList";
// import { useMessage } from "../../hooks/useMessage";
// import { renderStatus, statusList } from "../../utils/userStatus";
// import { setMyStatus } from "../../api/userStatus";
// import { useFriendsStatus } from "../../context/FriendsStatusContext";
// import { useCurrentUser } from "../../context/CurrentUserContext";

const { Header } = Layout;
const { Text } = Typography;

function Navbar() {
  // const isMobile = useMobile();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1042px)" }); // return true if right size

  const handlePost = () => {
    history.push("/post/create");
  };

  const handleFeed = () => {
    history.push("/feed");
  };

  const handleMessage = () => {
    history.push("/message");
  };

  const MainMenuItems = () => {
    return (
      <Menu
        style={styles.greenBackground}
        theme="dark"
        mode={!isSmallScreen ? "horizontal" : "vertical"}
        // defaultSelectedKeys={[selectedMenu]}
      >
        <Menu.Item
          key="feed"
          className="navitem pickitem text-center"
          onClick={handleFeed}
        >
          <Tooltip title="Feed" placement="bottom">
            <GlobalOutlined style={{ fontSize: 24, color: COLOR.white }} />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="noti" className="navitem notpickitem text-center">
          <Dropdown
            // overlay={NotificationList({
            //   handleClickNotificationItem,
            //   notifications,
            // })}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Badge count={0} showZero>
              <Tooltip title="Notifications" placement="bottom">
                <BellFilled
                  className="clickable"
                  // onClick={handleNoti}
                  style={{ fontSize: 24, color: COLOR.white }}
                />
              </Tooltip>
            </Badge>
          </Dropdown>
        </Menu.Item>

        <Menu.Item
          key="edit"
          className="navitem pickitem text-center"
          onClick={handlePost}
        >
          <Tooltip title="Post" placement="bottom">
            <EditFilled style={{ fontSize: 24, color: COLOR.white }} />
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="message"
          className="text-center navitem pickitem"
          onClick={handleMessage}
        >
          <Badge count={0}>
            <Tooltip title="Message" placement="bottom">
              <MessageFilled style={{ fontSize: 24, color: COLOR.white }} />
            </Tooltip>
          </Badge>
        </Menu.Item>

        <Menu.Item key="avatar" className="text-center navitem notpickitem">
          <Tooltip
            title={
              <div className="text-center">
                <div>Hoàng Bảo Ngọc</div>
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
              //   alt={Hoàng Bảo Ngọc}
              //   src={currentUser?.avatarUrl}
            >
              Hoàng Bảo Ngọc
            </Avatar>
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
  };

  //#region menuMore

  //   const menuStatus = (
  //     <Menu>
  //       {statusList.map((item, i) => (
  //         <Menu.Item key={i}>
  //           <Row align="middle" style={{ color: item.color }}>
  //             <GrStatusGoodSmall className="mr-2" />
  //             <Text>{item.status}</Text>
  //           </Row>
  //         </Menu.Item>
  //       ))}
  //     </Menu>
  //   );

  const menuMore = (
    <Menu>
      {isSmallScreen && <MainMenuItems />}
      <Menu.Item key="settings">
        <Row align="middle">
          <SettingOutlined className="mr-lg-2" />
          <Text>Settings</Text>
        </Row>
      </Menu.Item>

      {/* <Dropdown
        overlay={menuStatus}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Tooltip title="Status" placement="right">
          <GrStatusGoodSmall className="clickable icon" />
        </Tooltip>
      </Dropdown> */}

      <Menu.Item key="logout">
        <Row align="middle">
          <LogoutOutlined className=" red mr-2" />
          <Text>Logout</Text>
        </Row>
      </Menu.Item>
    </Menu>
  );

  const menuAuth = (
    <Menu className="bg-green-smoke">
      <Menu.Item key="login" className="text-center">
        <Link to="/login">
          <Text>Login</Text>
        </Link>
      </Menu.Item>
      <Menu.Item key="signup" className="text-center">
        <Link to="/register">
          <Text>Register</Text>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        ...styles.greenBackground,
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
          {!isSmallScreen && <MainMenuItems />}

          <Menu theme="dark" mode="horizontal" style={styles.greenBackground}>
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
        {/* ) : (
          <>
            <Menu
              style={styles.greenBackground}
              theme="dark"
              mode={!isSmallScreen ? "horizontal" : "vertical"}
              defaultSelectedKeys={[selectedMenu]}
            >
              {!isSmallScreen ? (
                menuAuth
              ) : (
                <Dropdown
                  overlay={menuAuth}
                  trigger={["click"]}
                  placement="bottomCenter"
                >
                  <EllipsisOutlined
                    style={{ fontSize: 24, color: COLOR.white }}
                  />
                </Dropdown>
              )}
            </Menu>
          </>
        )} */}
      </Row>
    </Header>
  );
}

export default Navbar;

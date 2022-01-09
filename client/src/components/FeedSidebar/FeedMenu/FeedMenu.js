import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import styles from "../styles.js";
import { Link } from "react-router-dom";

function FeedMenu({ user }) {
  return (
    <Menu
      mode="inline"
      style={{
        height: "100%",
        borderRight: 0,
        fontWeight: 500,
        fontSize: "1rem",
      }}
    >
      <Menu.Item
        key="username"
        style={styles.item}
        icon={<UserOutlined style={{ fontSize: "1.4rem" }} />}
      >
        <Link to={`/userinfo/${user?._id}`}>My Profile</Link>
      </Menu.Item>

      <Menu.Item
        key="friends"
        style={styles.item}
        icon={<TeamOutlined style={{ fontSize: "1.4rem" }} />}
      >
        <Link to="/friends">Following</Link>
      </Menu.Item>
      <Menu.Item
        key="contests"
        style={styles.item}
        icon={<CheckSquareOutlined style={{ fontSize: "1.4rem" }} />}
      >
        <Link to="/contests">Contests</Link>
      </Menu.Item>
    </Menu>
  );
}

export default FeedMenu;

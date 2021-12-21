import React from "react";
import { Layout } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import FeedSidebar from "../../components/Comment/FeedSidebar/FeedSidebar.js";

import styles from "./styles.js";
import "./styles.css";

const { Content } = Layout;

const FeedPage = () => {
  return (
    <Layout>
      <Navbar selectedMenu="feed" />
      <Layout style={styles.mainArea}>
        <div className="feed-container">
          <FeedSidebar className="sidebar" />
        </div>
      </Layout>
    </Layout>
  );
};

export default FeedPage;

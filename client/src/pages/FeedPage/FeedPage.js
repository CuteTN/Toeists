import React from "react";
import { Layout } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import FeedSidebar from "../../components/FeedSidebar/FeedSidebar";
import ListPosts from "./ListPosts/ListPosts";
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
          <div
            className="mainContent "
            id="scrollableDiv"
            style={{ minWidth: "86vw" }}
          >
            <ListPosts space="news_feed" hasMarginLeft />
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default FeedPage;

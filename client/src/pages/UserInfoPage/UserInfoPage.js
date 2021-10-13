import React, { useEffect } from "react";
import { Layout } from "antd";
import { AvatarView, ListButtons } from "../../components/index";
import styles from "./styles.js";

import Navbar from "../../components/Navbar/Navbar";

const { Content } = Layout;

function UserInfoPage() {
  return (
    <Layout>
      <Navbar />
      <Layout style={styles.avatarView}>
        <Content
          className="container"
          style={{
            padding: 8,
          }}
        >
          <AvatarView></AvatarView>
          <ListButtons />
        </Content>
      </Layout>
      {/* <Layout style={styles.mainArea}>
          <Content className="container">
            <Row>
              <div className="col-md-4">
                <IntroCard />
              </div>
              <div className="col-md-8">
                <FeedPosts space="user_profile" ownerId={id} />
              </div>
            </Row>
          </Content>
        </Layout> */}
    </Layout>
  );
}

export default UserInfoPage;

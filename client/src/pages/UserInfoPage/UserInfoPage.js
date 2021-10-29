import React, { useEffect, createContext, useState } from "react";
import { Layout, Row } from "antd";
import { AvatarView, ListButtons, IntroCard } from "../../components/index";

import styles from "./styles.js";
import { useParams } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUser } from "../../redux/actions/user.js";
const { Content } = Layout;

function UserInfoPage() {
  let { id } = useParams();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const history = useHistory();
  useEffect(() => {
    dispatch(getUser(id, history));
  }, [id]);

  // useEffect(() => {
  //   async function getUserInfo() {
  //     await api
  //       .getUserById(id)
  //       .then((res) => {
  //         console.info(res.data);
  //         ////////////////////
  //       })
  //       .catch((error) => {
  //         if (error.response?.status === 404) history.push("/error404");
  //       });
  //   }
  // });

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
      <Layout style={styles.mainArea}>
        <Content className="container">
          <Row>
            <div className="col-md-4">
              <IntroCard />
            </div>
            {/* <div className="col-md-8">
                <FeedPosts space="user_profile" ownerId={id} />
              </div> */}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default UserInfoPage;

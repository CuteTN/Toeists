import React, { useEffect, createContext, useState } from "react";
import { Layout, Row } from "antd";
import { AvatarView, ListButtons, IntroCard } from "../../components/index";

import styles from "./styles.js";
import { useParams } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUser } from "../../redux/actions/user.js";
import { isLoginUser, checkBlock } from "../../utils/user";
import { useAuth } from "../../contexts/authenticationContext";
import ErrorPage from "./../ErrorPage/ErrorPage";
import ListPosts from "../FeedPage/ListPosts/ListPosts";
// import ErrorPage from "../../ErrorPage/ErrorPage";
const { Content } = Layout;

function UserInfoPage() {
  let { id } = useParams();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isMyProfile = isLoginUser(user);
  const history = useHistory();
  const { signedInUser } = useAuth();
  const isBlocked = checkBlock(user);

  useEffect(() => {
    dispatch(getUser(id, history));
  }, [id]);

  return (
    <>
      {!isBlocked ? (
        <Layout>
          <Navbar />
          <Layout style={styles.avatarView}>
            <Content
              className="container"
              style={{
                paddingTop: 0,
                paddingBottom: 8,
              }}
            >
              <AvatarView />
              <ListButtons />
            </Content>
          </Layout>
          <Layout style={styles.mainArea}>
            <Content className="container">
              <Row>
                <div className="col-md-4">
                  <IntroCard />
                </div>
                <div className="col-md-8">
                  <ListPosts space="user_profile" creatorId={id} />
                </div>
              </Row>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <ErrorPage code="403" />
      )}
    </>
  );
}

export default UserInfoPage;

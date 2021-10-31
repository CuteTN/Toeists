import React, { useEffect, useState } from "react";
import { Button, Menu, message, Row, Modal, Input, Alert } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { isLoginUser, checkFollow } from "../../../utils/user.js";
import { followUser } from "../../../redux/actions/user";
import * as apiConnection from "./../../../services/api/userConnection";
import { useAuth } from "../../../contexts/authenticationContext.js";
import styles from "./styles.js";

const { TextArea } = Input;

const ListButtons = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const isMyProfile = isLoginUser(user);
  const isFollowed = checkFollow(user);
  const { signedInUser } = useAuth();
  const [loadingFollow, setLoadingFollow] = useState(false);

  const handleFollowUser = async () => {
    await apiConnection.follow(user?._id);
    // dispatch(followUser(user?.username));
  };

  const handleUnfollowUser = async () => {
    console.error(user);
    await apiConnection
      .unfollow(user?._id)
      .then(() => message.success({ content: "ABCDEFGH" }))
      .catch(() => message.error({ content: "Something went wrong." }));
  };

  const handleBlockUser = async () => {
    await apiConnection
      .block(user)
      .then(() => history.push("/error404"))
      .catch(() => message.error({ content: "Something went wrong." }));
  };

  const FollowButton = () => {
    if (!isMyProfile) {
      if (isFollowed)
        return (
          <Button
            className="orange-button"
            style={styles.button}
            onClick={handleUnfollowUser}
            // loading={loadingFollow}
          >
            UnFollow
          </Button>
        );
      else
        return (
          <Button
            className="orange-button"
            style={styles.button}
            onClick={handleFollowUser}
            // loading={loadingFollow}
          >
            Follow
          </Button>
        );
    }
    return <></>;
  };

  const ReportButton = () => {
    if (!isMyProfile) {
      return (
        <Button
          className="orange-button"
          style={{ ...styles.button, backgroundColor: "red", color: "white" }}
          onClick={handleBlockUser}
        >
          Block
        </Button>
      );
    }
    return <></>;
  };

  const ModalReport = () => {
    let contentReport = "";

    return (
      <Modal
        title="Why do you think this user should be reported?"
        // visible={isModalReport}
        onOk={() => {}}
        onCancel={() => {}}
      >
        <TextArea
          style={{ height: 200 }}
          onChange={(e) => {
            contentReport = e.target.value;
          }}
          // value={contentReport}
          autoSize={{ minRows: 3, maxRows: 15 }}
        />
      </Modal>
    );
  };
  return (
    <>
      <Row
        style={{
          marginLeft: 16,
          marginRight: 32,
          marginTop: 32,
          justifyContent: "space-between",
        }}
      >
        <ModalReport></ModalReport>
        <div style={{ marginBottom: 62, maxWidth: "60vw" }} />
        <Row style={{ marginTop: 16 }}>
          <FollowButton></FollowButton>
          <ReportButton></ReportButton>
        </Row>
      </Row>
    </>
  );
};

export default ListButtons;

import React, { useEffect, useState } from "react";
import { Button, Menu, message, Row, Modal, Input, Alert } from "antd";
import { Link, useLocation } from "react-router-dom";

import styles from "./styles.js";

const { TextArea } = Input;

const ListButtons = () => {
  const [isModalReport, setIsModalReport] = useState(false);
  const [contentReport, setContentReport] = useState("");
  const FriendButtons = () => {
    return (
      <Row>
        <Button className="green-button" style={styles.button}>
          Unfriend
        </Button>
      </Row>
    );
  };

  // refactor this
  const AddFriendButton = () => {
    // console.log(matchingFriendRequest);

    // if not my profile and have no friend request, display add friend button
    //console.log("have no request");
    return (
      <Button className="green-button" style={styles.button}>
        Add friend
      </Button>
    );
  };

  const FollowButton = () => {
    return (
      <Button className="green-button" style={styles.button}>
        Follow
      </Button>
    );
  };

  const ReportButton = () => {
    return (
      <Button
        className="green-button"
        style={{ ...styles.button, backgroundColor: "red", color: "white" }}
        onClick={() => {
          setIsModalReport(true);
          console.log("hello");
        }}
      >
        Report
      </Button>
    );
  };

  const ModalReport = () => {
    let contentReport = "";

    return (
      <Modal
        title="Why do you think this user should be reported?"
        visible={isModalReport}
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
        <div style={{ marginBottom: 32, maxWidth: "50vw" }}>
          <Menu mode="horizontal">
            <Menu.Item key="post">
              <Link style={styles.linkView}>Post</Link>
            </Menu.Item>

            <Menu.Item key="about">
              <Link style={styles.linkView}>About</Link>
            </Menu.Item>
          </Menu>
        </div>
        <Row style={{ marginTop: 16 }}>
          <AddFriendButton />
          {FollowButton()}
          <ReportButton></ReportButton>
        </Row>
      </Row>
    </>
  );
};

export default ListButtons;

import React, { useEffect, useState } from "react";
import { Button, Menu, message, Row, Modal, Input, Alert } from "antd";
import { Link, useLocation } from "react-router-dom";

import styles from "./styles.js";

const { TextArea } = Input;

const ListButtons = () => {
  const getDefaultSelectedItem = () => {
    switch (location.pathname) {
      case `/userinfo`:
        return "post";
      case `/userinfo/about`:
        return "about";
      default:
        break;
    }
  };

  const defaultSelectedKey = getDefaultSelectedItem();

  const [selectedMenu, setSelectedMenu] = useState(defaultSelectedKey);
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

  const FollowButton = () => {
    return (
      <Button className="orange-button" style={styles.button}>
        Follow
      </Button>
    );
  };

  const ReportButton = () => {
    return (
      <Button
        className="red-button"
        style={{ ...styles.button, backgroundColor: "red", color: "white" }}
        onClick={() => {
          // setIsModalReport(true);
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
        <div style={{ marginBottom: 32, maxWidth: "60vw" }}>
          <Menu mode="horizontal" selectedKeys={[selectedMenu]}>
            <Menu.Item key="post">
              <Link style={styles.linkView}>Post</Link>
            </Menu.Item>

            <Menu.Item key="about">
              <Link style={styles.linkView}>About</Link>
            </Menu.Item>
          </Menu>
        </div>
        <Row style={{ marginTop: 16 }}>
          {FollowButton()}
          <ReportButton></ReportButton>
        </Row>
      </Row>
    </>
  );
};

export default ListButtons;

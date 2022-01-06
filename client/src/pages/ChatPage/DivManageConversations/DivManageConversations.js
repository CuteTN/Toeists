import React from "react";
import { Avatar, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
//others
import "./style.css";

const DivManageConversations = () => (
  <div className="div-manage-conversations-wrapper">
    <div>
      <Avatar
        size={50}
        src="https://res.klook.com/image/upload/v1596021224/blog/a5nzbvlpm0gfyniy6s7r.jpg"
      />
    </div>
    <div>
      <h3 className="title-chat">Messages</h3>
    </div>
    <div className="button-add">
      <Button
        className="d-flex justify-content-center align-items-center orange-button mr-5"
        icon={<PlusCircleOutlined />}
      >
        Add
      </Button>
    </div>
  </div>
);
export default DivManageConversations;

import React, { useState, useEffect, useReducer } from "react";
import {
  Avatar,
  Typography,
  Row,
  Space,
  Divider,
  Menu,
  Dropdown,
  message,
  Tooltip,
  Modal,
} from "antd";
import {
  EllipsisOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LinkOutlined,
  DeleteFilled,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
// import COLOR from "../../constants/colors";
// import CommentForm from "../CommentForm/CommentForm";
import moment from "moment";
import { useAuth } from "../../../contexts/authenticationContext";
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const OwnerInformation = ({ comment, onDelete, isEdit, setIsEdit }) => {
  const { signedInUser } = useAuth();

  const isCommentOwner = () => {
    return signedInUser?._id === comment?.creatorId;
  };

  const showConfirmDeleteComment = (id) => {
    confirm({
      title: "Do you want to delete this comment?",
      icon: <ExclamationCircleOutlined />,
      content: "You cannot undo this action",
      onOk() {
        onDelete(id);
        message.success("Comment has been deleted");
      },
      onCancel() {
        message.info("Comment is not deleted");
      },
    });
  };
  const handleDelete = () => {
    showConfirmDeleteComment(comment?._id);
  };

  const onMoreSelect = ({ key }) => {
    switch (key) {
      case "0":
        setIsEdit(true);
        break;
      case "1":
        handleDelete();
        break;
      default:
        break;
    }
  };

  const menuMore = (
    <Menu onClick={onMoreSelect}>
      <Menu.Item key="0">
        <Row align="middle">
          <EditOutlined className="mr-2" />
          <Text>Edit comment</Text>
        </Row>
      </Menu.Item>
      <Menu.Item key="1">
        <Row align="middle">
          <DeleteFilled className="red mr-2" />
          <Text className="red">Delete comment</Text>
        </Row>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Row
        className={`pb-2`}
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Row className="align-items-center" style={{ marginBottom: 12 }}>
          <Avatar
            className="ml-1 clickable"
            size={45}
            src="https://res.klook.com/image/upload/v1596021224/blog/a5nzbvlpm0gfyniy6s7r.jpg"
          />
          <div className="d-inline-flex flex-column ml-3 break-word">
            <Row style={{ alignItems: "center" }}>
              <Space size={4}>
                <Text
                  className="clickable"
                  strong
                  style={{ fontSize: "1.2rem" }}
                >
                  Thy Xinh đẹp
                </Text>
              </Space>
            </Row>
          </div>
        </Row>
        <Row className="justify-content-end align-items-center pb-3">
          <div className="mr-4">
            <Text className="clickable" underline type="secondary">
              {`Last edited ${moment(comment?.contentUpdatedAt).fromNow()}`}
            </Text>
          </div>
          {isCommentOwner() && (
            <Dropdown
              overlay={menuMore}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="clickable">
                <EllipsisOutlined className="clickable icon" />
              </div>
            </Dropdown>
          )}
        </Row>
      </Row>
    </div>
  );
};

export default OwnerInformation;

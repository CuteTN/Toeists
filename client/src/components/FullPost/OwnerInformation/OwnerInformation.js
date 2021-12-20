import React from "react";
import {
  Avatar,
  Typography,
  Row,
  Space,
  Menu,
  Dropdown,
  message,
  Tooltip,
  Modal,
} from "antd";

import {
  EllipsisOutlined,
  EditFilled,
  DeleteFilled,
  BellOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MdPublic } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
// api
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { deletePost } from "../../../redux/actions/posts";
import { useAuth } from "../../../contexts/authenticationContext";
import moment from "moment";
//others
import styles from "./styles";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

function OwnerInformation({ post }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { signedInUser } = useAuth();

  const handleMore = () => {};

  const handleFollowPost = (id) => {};

  //#region menu more

  // const showConfirmDeletePost = (id) => {
  //   confirm({
  //     title: "Do you want to delete this post?",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "You cannot undo this action",
  //     onOk() {
  //       dispatch(deletePost(id));
  //       message.success("Post has been deleted");
  //       history.push("/feed");
  //       window.location.reload(); // load feed to have new items
  //     },
  //     onCancel() {
  //       message.info("Post is not deleted");
  //     },
  //   });
  // };

  const handleDeletePost = (id) => {
    // showConfirmDeletePost(id);
  };

  const handleEditPost = (postId) => {
    // history.push({
    //   pathname: "/post/create",
    //   state: { postId },
    // });
  };

  const menuMore = (
    <Menu>
      {signedInUser?._id === post?.creatorId ? (
        <>
          <Menu.Item
            key="edit"
            onClick={() =>
              handleEditPost(
                post?._id,
                post?.title,
                post?.privacy,
                post?.content
              )
            }
          >
            <Row align="middle">
              <EditFilled className="mr-2" />
              <Text>Edit post</Text>
            </Row>
          </Menu.Item>
          <Menu.Item
            key="delete"
            onClick={() => {
              handleDeletePost(post?._id);
            }}
          >
            <Row align="middle">
              <DeleteFilled className="red mr-2" />
              <Text className="red">Delete post</Text>
            </Row>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="follow" onClick={() => handleFollowPost(post._id)}>
          <Row align="middle">
            <BellOutlined className="mr-2" />
            <Text>Follow post</Text>
          </Row>
        </Menu.Item>
      )}
    </Menu>
  );

  // const renderUserInfo = () => {
  //   const userInfo = post?.userId?.userInfo;
  //   const education = userInfo.educations?.[userInfo.educations?.length - 1];
  //   const work = userInfo.works?.[userInfo.works?.length - 1];
  //   const educationInfo = education
  //     ? `${education?.moreInfo} at ${education?.schoolName}`
  //     : null;
  //   const workInfo = work ? `${work?.position} at ${work?.location}` : null;
  //   return workInfo || educationInfo;
  // };

  const renderPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "Private":
        return <IoPerson className="gray mr-1 icon" />;
      case "Public":
        return <MdPublic className="gray mr-1 icon" />;
      default:
        return <MdPublic className="gray mr-1 icon" />;
    }
  };

  return (
    <div>
      <Row
        className="pb-2"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Row className="align-items-center" style={{ marginBottom: 16 }}>
          <Avatar
            className="ml-1 clickable"
            size={45}
            src="https://res.klook.com/image/upload/v1596021224/blog/a5nzbvlpm0gfyniy6s7r.jpg"
          />
          <div className="d-inline-flex flex-column ml-3 break-word">
            <Row style={{ alignItems: "center" }}>
              <Space size={4}>
                <Link to={`/userinfo/${post?.userId}`} target="_blank">
                  <Text
                    className="clickable"
                    strong
                    style={{ fontSize: "1.2rem" }}
                  >
                    Thy Xinh Đẹp
                  </Text>
                </Link>
              </Space>
            </Row>
            {/* <Text strong className="green">
                {renderUserInfo()}
              </Text> */}
          </div>
        </Row>
        <Row className="justify-content-end align-items-center pb-3">
          {renderPrivacyIcon(post?.privacy)}
          <Tooltip title="Privacy">
            <div className="mr-4">
              <Text type="secondary">{post?.privacy}</Text>
            </div>
          </Tooltip>
          <div className="mr-4">
            <Tooltip title={`Created ${moment(post?.createdAt).fromNow()}`}>
              <Text className="clickable" underline type="secondary">
                {`Last edited ${moment(post?.contentUpdatedAt).fromNow()}`}
              </Text>
            </Tooltip>
          </div>
          <Dropdown
            overlay={menuMore}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="clickable" onClick={handleMore}>
              <EllipsisOutlined className="clickable icon" />
            </div>
          </Dropdown>
        </Row>
      </Row>
    </div>
  );
}

export default OwnerInformation;

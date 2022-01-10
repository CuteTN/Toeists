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
import { Link } from "react-router-dom";
import {
  EllipsisOutlined,
  DeleteFilled,
  BellOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { IoCheckbox } from "react-icons/io5";
// api
import { deleteContest } from "../../../services/api/contest";
//context
import { useAuth } from "../../../contexts/authenticationContext";

const { Title, Text } = Typography;
const { confirm } = Modal;

const TitleContest = ({ contest }) => {
  const { signedInUser } = useAuth();

  const handleMore = () => {};

  const handleFollowContest = (id) => {};

  const handleDelete = (id) => {
    deleteContest(id)
      .then((res) => {
        message.success("Contest has been deleted");
        history.push("/contests");
        window.location.reload(); // load feed to have new items
      })
      .catch((error) => message.success(error.message));
  };

  const showConfirmDeleteContest = (id) => {
    confirm({
      title: "Do you want to delete this Contest?",
      icon: <ExclamationCircleOutlined />,
      content: "You cannot undo this action",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        message.info("Contest is not deleted");
      },
    });
  };

  const handleDeleteContest = (id) => {
    showConfirmDeleteContest(id);
  };

  const menuMore = (
    <Menu>
      {signedInUser?._id === contest?.creatorId ? (
        <>
          <Menu.Item
            key="delete"
            onClick={() => {
              handleDeleteContest(contest?._id);
            }}
          >
            <Row align="middle">
              <DeleteFilled className="red mr-2" />
              <Text className="red">Delete contest</Text>
            </Row>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item
          key="follow"
          onClick={() => handleFollowContest(contest._id)}
        >
          <Row align="middle">
            <BellOutlined className="mr-2" />
            <Text>Follow contest</Text>
          </Row>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      <Row
        className="pb-2"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Row className="align-items-center">
          <Title level={2}>
            [Part{contest?.part}] {contest?.title}
          </Title>
        </Row>
        <Row className="justify-content-end align-items-center pb-3">
          <IoCheckbox className="gray mr-1 icon" />
          <Tooltip title="submits">
            <div className="mr-4">
              <Text type="secondary">100 Submissions</Text>
            </div>
          </Tooltip>
          {/* <div className="mr-4">
            <Tooltip title={`Created ${moment(contest?.createdAt).fromNow()}`}>
              <Text className="clickable" underline type="secondary">
                {`Last edited ${moment(contest?.contentUpdatedAt).fromNow()}`}
              </Text>
            </Tooltip>
          </div> */}
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
      <Row
        className="pb-2"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Row className="align-items-center">
          <Text
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginRight: 15,
            }}
          >
            Creator:
          </Text>
          <Avatar
            className="ml-1 clickable"
            size={35}
            // src={contest?.creator?.avatarUrl}
            src={contest?.creator?.avatarUrl}
          ></Avatar>
          <div className="d-inline-flex flex-column ml-3 break-word">
            <Row style={{ alignItems: "center" }}>
              <Space size={4}>
                <Link to={`/userinfo/${contest?.creator?._id}`} target="_blank">
                  <Text
                    className="clickable"
                    strong
                    style={{ fontSize: "1.2rem" }}
                  >
                    {contest?.creator?.name}
                  </Text>
                </Link>
              </Space>
            </Row>
          </div>
        </Row>
      </Row>
    </div>
  );
};

export default TitleContest;

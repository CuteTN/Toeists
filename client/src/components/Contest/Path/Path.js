import React from "react";
import { Row, Space, Tooltip, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { LinkOutlined } from "@ant-design/icons";
import { IoCaretForwardSharp } from "react-icons/io5";
import ShareButton from "../ShareButton/ShareButton";
import { useAuth } from "../../../contexts/authenticationContext";

const { Text } = Typography;
const Path = ({ contest }) => {
  const { signedInUser } = useAuth();

  const copyLink = (id) => {
    navigator.clipboard
      .writeText(`http://localhost:3000/contests/${id}`) // change to deployment link later
      .then(() => message.success("Link copied to clipboard"))
      .catch((error) => {
        message.error("Something goes wrong copying link");
        console.log(id);
      });
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Row className="justify-content-between mb-4">
        <Row>
          <Space size="large">
            <Space>
              <IoCaretForwardSharp className="red mr-2" />
              <Link to={`/contests/${contest?._id}`} target="_blank">
                <Text
                  style={{ fontSize: "1.2rem" }}
                  className=" clickable bold mx-2"
                >
                  Go to the Contest
                </Text>
              </Link>
            </Space>
          </Space>
        </Row>
        <Row>
          <Space size="large">
            <Tooltip title="Copy link">
              <LinkOutlined
                className="clickable icon"
                onClick={() => copyLink(contest._id)}
              />
            </Tooltip>
            <ShareButton contest={contest} />
          </Space>
        </Row>
      </Row>
    </div>
  );
};

export default Path;

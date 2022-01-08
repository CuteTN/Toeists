import React, { useEffect, useState } from "react";
import { Avatar, Button, Image, Typography, message, Row, Menu, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { convertFileToBase64 } from "../../../utils/image.js";
import styles from "./styles.js";
import { AiFillEdit, BsTrash, BsUpload } from "react-icons/all";
import COLOR from "../../../constants/colors.js";
import { getUser } from "../../../redux/actions/user"
import { uploadUserAvatar } from "../../../services/uploadUserAvatar.js";
import { useAuth } from "../../../contexts/authenticationContext.js";
import Text from "antd/lib/typography/Text";
import confirm from "antd/lib/modal/confirm";

const { Title } = Typography;

const AvatarView = () => {
  const { signedInUser } = useAuth();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const displayName = user?.name ?? "";

  const avatarFileInputRef = React.useRef(null);
  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    uploadUserAvatar(user._id, user.avatarUrl, selectedFile)
      .then(() => dispatch(getUser(user._id)));
  };

  const handleUploadAvatar = () => {
    avatarFileInputRef.current.click()
  }

  const handleDeleteAvatar = () => {
    confirm({
      title: "Remove avatar",
      content: "Are you sure to remove this avatar?",
      onOk: () => {
        uploadUserAvatar(user?._id, user?.avatarUrl, null)
          .then(() => dispatch(getUser(user?._id)));
      },
    })
  }

  const UpdateAvatarMenu = () => {
    return (
      <Menu>
        <Menu.Item key="upload" onClick={handleUploadAvatar}>
          <Row align="middle">
            <BsUpload size={20} className="mr-lg-2" />
            <Text>Upload a new avatar</Text>
          </Row>
        </Menu.Item>

        <Menu.Item key="remove" onClick={handleDeleteAvatar}>
          <Row align="middle">
            <BsTrash size={20} className="mr-lg-2" color="red" />
            <Text style={{ color: "red" }}>Remove this avatar</Text>
          </Row>
        </Menu.Item>
      </Menu>
    )
  }

  const UpdateAvatarButton = () => {
    return (
      <div>
        <Button
          className="orange-button mr-2"
          style={styles.editImageBtn}
        >
          <Dropdown
            trigger={["click"]}
            placement="bottomLeft"
            overlay={UpdateAvatarMenu()}
          >
            <AiFillEdit size={36} style={{ color: COLOR.white, position: "absolute", top: 5, left: 5 }} />
          </Dropdown>
        </Button>

      </div>
    );
  };

  return (
    <div style={{ position: "relative", height: "40vh" }}>
      <Row
        className="container justify-content-center"
        style={{ height: "20vh" }}
      >
        <div
          className="d-flex justify-content-center flex-column align-items-center"
          style={{ position: "absolute", bottom: "-10%" }}
        >
          <div style={{ position: "relative", marginBottom: 8 }}>
            <div >
              <Avatar
                src={user?.avatarUrl}
                size={200}
                style={styles.avatar}
              >
                {user?.username}
              </Avatar>

              <input
                type="file"
                name="myImage"
                accept="image/png, image/gif, image/jpeg"
                ref={avatarFileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              ></input>

              {signedInUser?._id === user?._id &&
                <UpdateAvatarButton />
              }
            </div>
          </div>

          <Title style={styles.displayName}>{displayName}</Title>
        </div>
      </Row>
    </div>
  );
};

export default AvatarView;
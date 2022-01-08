import React, { useEffect, useState } from "react";
import { Avatar, Button, Image, Typography, message, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { convertFileToBase64 } from "../../../utils/image.js";
import styles from "./styles.js";
import { AiFillEdit } from "react-icons/all";
import COLOR from "../../../constants/colors.js";
import { getUser } from "../../../redux/actions/user"
import { uploadUserAvatar } from "../../../services/uploadUserAvatar.js";
import { useAuth } from "../../../contexts/authenticationContext.js";
import { BLANK_AVATAR_URL } from "../../../constants/resources.js";

const { Title } = Typography;

const AvatarView = () => {
  const { signedInUser } = useAuth();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const avatarUrl = React.useMemo(() => user?.avatarUrl ?? BLANK_AVATAR_URL, [user])

  const displayName = user?.name ?? "";

  const avatarFileInputRef = React.useRef(null);
  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0]; 
    uploadUserAvatar(user._id, user.avatarUrl, selectedFile)
      .then(() => dispatch(getUser(user._id)));
  };

  const EditAvatarButton = () => {
    return (
      <div>
        <Button
          className="orange-button mr-2"
          style={styles.editImageBtn}
          onClick={() => avatarFileInputRef.current.click()}
        >
          <AiFillEdit size={36} style={{ color: COLOR.white, position: "absolute", top: 5, left: 5 }} />
        </Button>
        <input
          type="file"
          name="myImage"
          accept="image/png, image/gif, image/jpeg"
          ref={avatarFileInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        ></input>
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
            <div>
              <Avatar
                src={avatarUrl}
                size={200}
                style={styles.avatar}
              />
              {signedInUser?._id === user?._id &&
                <EditAvatarButton />
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
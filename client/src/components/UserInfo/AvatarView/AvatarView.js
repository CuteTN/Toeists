import React, { useEffect, useState } from "react";
import { Avatar, Button, Image, Typography, message, Row } from "antd";
import { useSelector } from "react-redux";
import styles from "./styles.js";

const { Title } = Typography;

const AvatarView = () => {
  const user = useSelector((state) => state.user);
  //   const isMyProfile = isLoginUser(user);

  const displayName = user?.name ?? "";
  const hiddenBackgroundFileInput = React.useRef(null);

  const EditImageButton = () => {
    return (
      <div>
        <Button className="orange-button mr-2" style={styles.editImageBtn}>
          Edit
        </Button>
        <input
          type="file"
          name="myImage"
          accept="image/png, image/gif, image/jpeg"
          ref={hiddenBackgroundFileInput}
          style={{ display: "none" }}
        ></input>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", height: "50vh" }}>
      <Row
        className="container justify-content-center"
        style={{ height: "40vh" }}
      >
        <Image
          src="https://imgur.com/zmfQSF0.png"
          style={{
            maxHeight: "40vh",
            width: "100%",
            objectFit: "cover",
            height: "auto",
            display: "block",
          }}
        ></Image>

        <EditImageButton />
        <div
          className="d-flex justify-content-center flex-column align-items-center"
          style={{ position: "absolute", bottom: "-10%" }}
        >
          <div style={{ position: "relative", marginBottom: 8 }}>
            <div>
              <Avatar
                src="https://giabaogroup.vn/wp-content/uploads/2020/08/noi-that-vintage-2.jpg"
                size={150}
                style={styles.avatar}
              />
              {/* <EditAvatarButton /> */}
            </div>
          </div>

          <Title style={styles.displayName}>{displayName}</Title>
        </div>
      </Row>
    </div>
  );
};

export default AvatarView;

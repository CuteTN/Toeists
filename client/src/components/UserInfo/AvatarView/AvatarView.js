import React, { useEffect, useState } from "react";
import { Avatar, Button, Image, Typography, message, Row } from "antd";
import { useSelector } from "react-redux";
import { convertFileToBase64 } from "../../../utils/image.js";
import styles from "./styles.js";

const { Title } = Typography;

const AvatarView = () => {
  const user = useSelector((state) => state.user);
  const [backgroundImage, setBackgroundImage] = useState(
    user?.backgroundUrl ?? "https://vnn-imgs-f.vgcloud.vn/2020/09/07/15/.jpg"
  );
  //   const isMyProfile = isLoginUser(user);

  const displayName = user?.name ?? "";
  const hiddenBackgroundFileInput = React.useRef(null);

  useEffect(() => {
    setBackgroundImage(
      user?.backgroundUrl ?? "https://vnn-imgs-f.vgcloud.vn/2020/09/07/15/.jpg"
    );
  }, [user]);

  const handleBackgroundChange = async (e) => {
    const fileUploaded = e.target.files[0];
    const base64 = await convertFileToBase64(fileUploaded);

    const image = {
      type: "backgroundUrl",
      base64: base64,
    };
    // const { data } = await apiUser.editImage(image);
    // setBackgroundImage(data);
  };

  const EditImageButton = () => {
    return (
      <div>
        <Button
          className="orange-button mr-2"
          style={styles.editImageBtn}
          onClick={() => hiddenBackgroundFileInput.current.click()}
        >
          Edit
        </Button>
        <input
          type="file"
          name="myImage"
          accept="image/png, image/gif, image/jpeg"
          ref={hiddenBackgroundFileInput}
          style={{ display: "none" }}
          onChange={handleBackgroundChange}
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

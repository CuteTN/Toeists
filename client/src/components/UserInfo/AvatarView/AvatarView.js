import React, { useEffect, useState } from "react";
import { Avatar, Button, Image, Typography, message, Row } from "antd";
import { useSelector } from "react-redux";
import styles from "./styles.js";

const { Title } = Typography;

const AvatarView = () => {
  const user = useSelector((state) => state.user);
  //   const isMyProfile = isLoginUser(user);

  //   const [avatar, setAvatar] = useState(user?.avatarUrl);
  //   const [loadingAvatar, setLoadingAvatar] = useState(false);

  //   const [backgroundImage, setBackgroundImage] = useState(user?.backgroundUrl);
  //   const [loadingBackground, setLoadingBackground] = useState(false);

  const displayName = user?.name ?? "";

  //   const hiddenAvatarFileInput = React.useRef(null);
  const hiddenBackgroundFileInput = React.useRef(null);

  //   useEffect(() => {
  //     setAvatar(user?.avatarUrl);
  //     setBackgroundImage(user?.backgroundUrl);
  //   }, [user]);

  //   const handleUploadPhoto = async (img, type) => {
  //     const data = createFormData(img);

  //     try {
  //       const res = await apiUpload.uploadImage(data, type);

  //       if (res) {
  //         return res.data.data.avatar;
  //       } else {
  //         return null;
  //       }
  //     } catch (error) {
  //       console.log("Error when upload img", error.message);
  //     }
  //   };

  //   const handleAvatarChange = async (e) => {
  //     setLoadingAvatar(true);
  //     const fileUploaded = e.target.files[0];
  //     // const base64 = await convertFileToBase64(fileUploaded);
  //     // console.log("file upload", fileUploaded);

  //     const resAvatar = await handleUploadPhoto(fileUploaded, "avatar");
  //     // console.log("res ava", resAvatar);

  //     if (!resAvatar) {
  //       message.error("Cannot upload image");
  //       return;
  //     }

  //     const image = {
  //       type: "avatarUrl",
  //       base64: resAvatar,
  //     };
  //     await apiUser.editImage(image).then((res) => {
  //       setLoadingAvatar(false);
  //       // setAvatar(res.data);
  //       window.location.reload();
  //     });
  //   };

  //   const handleBackgroundChange = async (e) => {
  //     setLoadingBackground(true);
  //     const fileUploaded = e.target.files[0];
  //     // const base64 = await convertFileToBase64(fileUploaded);

  //     const resBackground = await handleUploadPhoto(
  //       fileUploaded,
  //       "userBackground"
  //     );
  //     // console.log("res ava", resAvatar);

  //     if (!resBackground) {
  //       message.error("Cannot upload image");
  //       return;
  //     }

  //     const image = {
  //       type: "backgroundUrl",
  //       base64: resBackground,
  //     };
  //     await apiUser.editImage(image).then((res) => {
  //       setLoadingBackground(false);
  //       // setBackgroundImage(res.data);
  //       window.location.reload();
  //     });
  //   };

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

  //   const EditAvatarButton = () => {
  //     if (isMyProfile) {
  //       return (
  //         <div>
  //           <Button
  //             className="green-button"
  //             shape="circle"
  //             style={styles.editAvatarBtn}
  //             icon={<FaCamera />}
  //             onClick={() => hiddenAvatarFileInput.current.click()}
  //           ></Button>
  //           <input
  //             type="file"
  //             ref={hiddenAvatarFileInput}
  //             style={{ display: "none" }}
  //             onChange={handleAvatarChange}
  //           ></input>
  //         </div>
  //       );
  //     }
  //     return <></>;
  //   };

  //   if (!user) return <Loading />;

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

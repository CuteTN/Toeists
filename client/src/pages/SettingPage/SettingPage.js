import React, { useState } from "react";
import styles from "./styles.js";
import { Layout, Typography, Menu, message, Form, Input, Button } from "antd";

import Navbar from "../../components/Navbar/Navbar";

import COLOR from "../../constants/colors.js";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import EditableText from "./EditableText/EditableText";
import { useAuth } from "../../contexts/authenticationContext.js";
import * as authAPI from "../../services/api/user";
// import * as authAPI from "../../api/auth";
// import * as apiUser from "../../api/user_info";
// import { useCurrentUser } from "../../context/CurrentUserContext.js";

const { Text } = Typography;

const GeneralTab = () => {
  const { signedInUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(signedInUser);
  const [name, setName] = useState(currentUser?.name);
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber);

  const saveName = () => {
    console.error("tjhdsjfsjfd");
    const key = "updateUserInfo";
    message.loading({ content: "Saving your information...", key });

    const updatedFields = { name, phoneNumber };

    authAPI
      .updateUser(signedInUser?._id, updatedFields)
      .then((res) => {
        // console.log(res.data);
        setCurrentUser(res.data);
        message.success({ content: "Your information has been updated!", key });
      })
      .catch((error) => {
        console.log("Error updating user setting", error);
        message.error({ content: "Error updating user info", key });
      });
  };

  return (
    <div className="bg-white p-4">
      <h3>General</h3>
      <div
        style={{
          height: 1,
          backgroundColor: COLOR.gray,
          // marginTop: -20,
          marginBottom: 14,
        }}
      />
      <div>
        <div style={{ marginLeft: 12 }}>
          <EditableText
            firstIcon={
              <Text
                style={{ fontSize: 16, width: 150, color: COLOR.gray }}
                strong
              >
                Email
              </Text>
            }
            text={signedInUser?.email}
            placeholder="Email"
            // onChange={(value) => setEmail(value.target.value)}
            // onSave={saveAddress}
            setPreviousState={() => {
              // setAddress(user?.userInfo?.address ?? "VietNam");
            }}
            editable={false}
          />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: COLOR.whiteSmoke,
            marginTop: -20,
            marginBottom: 14,
          }}
        />
        <div style={{ marginLeft: 12 }}>
          <EditableText
            firstIcon={
              <Text
                style={{ fontSize: 16, width: 150, color: COLOR.gray }}
                strong
              >
                Username
              </Text>
            }
            text={signedInUser?.username}
            placeholder="Username"
            editable={false}
          />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: COLOR.whiteSmoke,
            marginTop: -20,
            marginBottom: 14,
          }}
        />
        <div style={{ marginLeft: 12 }}>
          <EditableText
            firstIcon={
              <Text
                style={{ fontSize: 16, width: 150, color: COLOR.gray }}
                strong
              >
                Name
              </Text>
            }
            text={currentUser?.name}
            placeholder="Name"
            onChange={(value) => setName(value.target.value)}
            onSave={saveName}
            setPreviousState={() => {
              setName(currentUser?.name ?? "");
            }}
            editable={true}
          />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: COLOR.whiteSmoke,
            marginTop: -20,
            marginBottom: 14,
          }}
        />
        <div style={{ marginLeft: 12 }}>
          <EditableText
            firstIcon={
              <Text
                style={{ fontSize: 16, width: 150, color: COLOR.gray }}
                strong
              >
                Phone Number
              </Text>
            }
            text={currentUser?.phoneNumber}
            placeholder="Phone Number"
            onChange={(value) => setPhoneNumber(value.target.value)}
            onSave={saveName}
            setPreviousState={() => {
              setPhoneNumber(currentUser?.phoneNumber ?? "");
            }}
            editable={true}
          />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: COLOR.whiteSmoke,
            marginTop: -20,
            marginBottom: 14,
          }}
        />
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const { signedInUser } = useAuth();

  const formDefault = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [form, setForm] = useState(formDefault);

  const handleFinish = () => {
    authAPI.resetPassword(signedInUser?._id, { 
      currentPassword: form.currentPassword, 
      newPassword: form.newPassword,
    })
      .then(() => {
        message.success("Your password has been updated.")
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? "Something went wrong."
        message.error(msg);
      })
  };

  const handleFinishFailed = () => {};
  
  const handleChange = (e) => {
    setForm({ ...form, [e?.target.name]: e?.target.value });
  };
  return (
    <div className="bg-white p-4">
      <h3>Security</h3>
      <div
        style={{
          height: 1,
          backgroundColor: COLOR.gray,
          // marginTop: -20,
          marginBottom: 14,
        }}
      />
      <h5>Change password</h5>
      <Form
        name="basic"
        size="large"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        className="mt-4"
      >
        <Form.Item name="currentPassword">
          <Input.Password
            name="currentPassword"
            autoComplete="newpassword"
            placeholder="Current password"
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Password is required.",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                // console.log("value", value.length);
                if (value.length >= 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Password must be at least 6 characters.")
                );
              },
            }),
          ]}
        >
          <Input.Password
            name="newPassword"
            autoComplete="newpassword"
            placeholder="New password"
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Password confirm is required.",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Password does not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            autoComplete="newpassword"
            placeholder="Confirm password"
            suffix={null}
          />
        </Form.Item>

        <Form.Item style={{}}>
          <Button
            style={{ width: "100%" }}
            className="orange-button"
            htmlType="submit"
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const SettingsTabs = [
  {
    tab: <GeneralTab />,
  },
  {
    tab: <SecurityTab />,
  },
];

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState("0");
  const handleSelectTab = (e) => {
    console.log("ekey", e.key);
    setCurrentTab(e.key);
  };
  return (
    <Layout>
      <Navbar />
      <div
        className="full"
        style={{
          ...styles.mainArea,
        }}
      >
        <Sider
          width="250"
          style={{
            // overflow: "auto",
            height: "100vh",
            position: "fixed",
            backgroundColor: "white",
          }}
        >
          <Menu
            style={{
              borderWidth: 0,
              backgroundColor: "white",
            }}
            onClick={handleSelectTab}
            selectedKeys={[currentTab]}
            mode="inline"
          >
            <h2 className="ml-3 mt-3">Settings</h2>
            <Menu.Item key="0">General</Menu.Item>
            <Menu.Item key="1">Security and Login</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ marginLeft: 350, marginTop: 32, marginRight: 100 }}>
          {SettingsTabs[currentTab].tab}
        </Content>
      </div>
    </Layout>
  );
};

export default SettingsPage;

import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Input,
  Form,
  Select,
  DatePicker,
  message,
} from "antd";

// import { ReactComponent as ReactLogo } from "../../assets/add-user.svg";
// import logo from "../../assets/lightlogo.png";
import addUserImage from "../../assets/signup.jpg";

import styles from "./styles";
import { Link } from "react-router-dom";
import { signup } from "../../redux/actions/auth";
import { useDispatch } from "react-redux";
import moment from "moment";
import COLOR from "../../constants/colors";
// import axios from "axios";
import { apiService } from "../../services/api";
import axios from "axios";
import { signUp as apiSignUp } from "../../services/api/user";

const { Title, Text } = Typography;

const { Option } = Select;

const dateFormat = "DD/MM/YYYY";

const initialState = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  birthday: "",
};

function SignUpPage() {
  const [form, setForm] = useState(initialState);
  const [resend, setResend] = useState(false);
  const disableReg = useRef(false);

  // DIRTY: refresh token test
  // React.useEffect(() => {
  // AuthenticationService.signIn('CuteTN', 'Test.123');

  // setInterval(() => {
  //   apiService.get('api/authorization').then(
  //     () => console.log("Ok"),
  //     () => console.log("401")
  //   )
  // }, 10000);
  // }, []);

  const setDisableReg = (b) => {
    disableReg.current = b;
  };

  const handleChange = (e) => {
    if (!e) return;
    setForm({ ...form, [e?.target.name]: e?.target.value });
    if (resend) setResend(false);
  };

  const handleChangeBirthday = (date) => {
    setForm({ ...form, birthday: date });
  };

  const handleChangeGender = (value) => {
    setForm({ ...form, gender: value });
  };

  const handleFinish = () => {
    if (disableReg.current === false) {
      const userData = { ...form }
      delete userData.confirmPassword;

      setDisableReg(true);
      apiSignUp(userData)
        .then(() => {
          message.success(`User ${userData.username} has successfully registered`);
        })
        .catch(err => {
          const errors = [];

          Object.values(err?.response?.data?.errors ?? {}).forEach(error => {
            if (error.message)
              errors.push(error.message);
          });

          handleFinishFailed(errors)
        })
        .finally(() => setDisableReg(false))
        ;
    }
  };

  const handleResend = () => {
    // resendVerificationMail(form.email);
    // message.success("Verification mail sent!");
  };

  const handleFinishFailed = (errors) => {
    if (!errors)
      return;

    errors?.forEach?.((err) => {
      message.error(err);
    });
  };

  return (
    <div
      className="full d-flex align-items-center justify-content-center"
      style={{ backgroundColor: COLOR.orangeSmoke }}
    >
      <div
        style={{
          width: 1000,
          paddingBottom: 0,
        }}
      >
        <Row style={{ justifyContent: "center" }}> </Row>
        <Card className="shadow-lg p-3 mb-5 bg-body rounded" bordered={false}>
          <Row style={{ alignItems: "center" }}>
            <div
              className="col-md-6"
              style={{ paddingRight: 24, marginBottom: 0 }}
            >
              <Row>
                <Link to="/"></Link>
                <Title style={{ marginBottom: 8 }}>Register</Title>
              </Row>
              <div style={{ marginBottom: 16 }}>
                <Text>
                  Already have an account?{" "}
                  <Link to="/signin">
                    <Text className="clickable orange bold">Sign in</Text>
                  </Link>
                </Text>
              </div>
              <Form
                name="basic"
                size="large"
                onFinish={resend ? handleResend : handleFinish}
                onFinishFailed={handleFinishFailed}
              >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Your name is required.",
                    },
                  ]}
                >
                  <Input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Username is required.",
                    },
                  ]}
                >
                  <Input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Invalid email.",
                    },
                    {
                      required: true,
                      message: "Email is required.",
                    },
                  ]}
                >
                  <Input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is required.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
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
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Password confirm is required.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Password does not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm password"
                    suffix={null}
                  />
                </Form.Item>

                <Row gutter={8}>
                  <Col span={10}>
                    <Form.Item
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Gender is required.",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Gender"
                        name="gender"
                        onChange={handleChangeGender}
                        style={{ width: "100%" }}
                      >
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name="birthday"
                      rules={[
                        {
                          required: true,
                          message: "Date of birth is required.",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            var now = moment();
                            var input = moment(value);
                            if (!value || now.diff(input, "years") >= 5) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("You must be at least 5 years old.")
                            );
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        name="birthday"
                        placeholder="Date of birth"
                        onChange={handleChangeBirthday}
                        style={{ width: "100%" }}
                        format={dateFormat}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{}}>
                  <Button
                    style={{ width: "100%" }}
                    className="orange-button"
                    htmlType="submit"
                  >
                    {resend ? "Resend verification mail" : "Create account"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div
              className="col-md-5 d-md-block d-sm-none d-none"
              style={{ marginTop: 0 }}
            >
              <div>
                <img
                  src={addUserImage}
                  alt="Register"
                  height="450"
                  // className="object-fit"
                  // height="58"
                  // className="mr-2"
                />
              </div>
            </div>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default SignUpPage;

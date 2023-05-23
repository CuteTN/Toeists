import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  message,
} from "antd";

// import logo from "../../assets/lightlogo.png";
import { GoogleLogin } from "react-google-login";
import { GrGoogle, GrFacebook } from "react-icons/gr";
import { Link, useHistory, useLocation } from "react-router-dom";
import COLOR from "../../constants/colors";
import { AuthenticationService } from "../../services/AuthenticationService";
import { useAuth } from "../../contexts/authenticationContext";
import addUserImage from "../../assets/add-user.png";
// import { useToken } from "../../context/TokenContext";
// import { useLocalStorage } from "../../hooks/useLocalStorage";
// import { AUTH } from "../../redux/actionTypes";
// import { BACKEND_URL, GITHUB_CLIENT_ID } from "../../constants/config";

const { Title, Text } = Typography;

const initialState = {
  identifier: "",
  password: "",
  remember: "",
};

function SignInPage() {
  const [form, setForm] = useState(initialState);
  // const [user, setUser] = useLocalStorage("user");
  const history = useHistory();
  const location = useLocation();
  const [resend, setResend] = useState(false);
  const disableSignIn = useRef(false);
  const { accessToken } = useAuth();
  const backUrl = new URLSearchParams(location.search).get("url");

  React.useEffect(() => {
    if (accessToken != null) routeBack();
  }, [accessToken]);

  const setDisableSignIn = (b) => {
    disableSignIn.current = b;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (resend === true) setResend(false);
  };

  const routeBack = () => {
    if (backUrl) history.replace(backUrl);
    else history.replace("/");
  };

  const handleFinish = async (values) => {
    if (disableSignIn.current === false) {
      setDisableSignIn(true);
      // const browserId = JSON.parse(localStorage.getItem("browser"))?.id;

      AuthenticationService.signIn(form.identifier, form.password)
        .then((res) => {
          message.success(`Welcome, ${res.data.username}!`);
        })
        .catch((error) => {
          const responseMessage = error?.response?.data?.message;
          if (responseMessage) handleFinishFailed(responseMessage);
          else {
            console.error(error);
            handleFinishFailed("Something went wrong!");
          }
        })
        .finally(() => setDisableSignIn(false));
    }
  };

  const handleResend = async () => {
    // resendVerificationMail(form.email);
    // message.success("Verification mail sent!");
  };

  const handleFinishFailed = (errorMsg) => {
    message.error(errorMsg);
  };

  return (
    <div
      className="full d-flex align-items-center justify-content-center"
      style={{ backgroundColor: COLOR.orangeSmoke }}
    >
      <div
        style={{
          width: 900,
          paddingBottom: 0,
        }}
      >
        <Card className="shadow-lg rounded" bordered={false}>
          <Row style={{ alignItems: "center" }}>
            <div
              className="col-md-6"
              style={{ paddingRight: 24, marginBottom: 24 }}
            >
              <div className="row">
                <Link to="/">
                  {/* <img src={logo} alt="Logo" height="58" className="mr-2" /> */}
                </Link>
                <Title style={{ marginBottom: 8 }}>Sign in</Title>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text>
                  No account?{" "}
                  <Link to="/signup">
                    <Text className="clickable orange bold">Create one!</Text>
                  </Link>
                </Text>
              </div>
              <Form name="basic" size="large" onFinish={handleFinish}>
                <Form.Item
                  name="identifier"
                  rules={[
                    {
                      required: true,
                      message: "User identifier is required.",
                    },
                  ]}
                >
                  <Input
                    name="identifier"
                    placeholder="Username or email"
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
                  ]}
                >
                  <Input.Password
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </Form.Item>
                <Row justify="end" style={{ marginBottom: 24 }}>
                  {/* <Checkbox name="remember" onChange={handleChange}>
                    Remember me
                  </Checkbox> */}
                  <Text className="clickable orange ">Forgot password?</Text>
                </Row>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    style={{ width: "100%" }}
                    className="orange-button"
                    htmlType="submit"
                  >
                    {resend ? "Resend verification mail" : "Sign in"}
                  </Button>
                </Form.Item>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginBottom: 16 }}
                >
                  <Text>Or sign in with</Text>
                </div>
                <Row>
                  <Col xs={24} lg={24} style={{ padding: 4 }}>
                    <GoogleLogin
                      clientId="870911963949-uhovihqpkloivbqnk2c5vgchedih3ej5.apps.googleusercontent.com"
                      render={(renderProps) => (
                        <Button
                          className="google-container"
                          // htmlType="submit"
                          icon={
                            <GrGoogle
                              style={{ marginBottom: 2.5, marginRight: 12 }}
                            />
                          }
                          onClick={renderProps.onClick}
                          // disabled={renderProps.disabled}
                          style={{ width: "100%" }}
                        >
                          Google
                        </Button>
                      )}
                      // onSuccess={googleSuccess}
                      // onFailure={googleError}
                      cookiePolicy="single_host_origin"
                    />
                  </Col>
                  {/* <Col xs={24} lg={8} style={{ padding: 4 }}>
                    <Button
                      className="facebook-container"
                      // htmlType="submit"
                      icon={
                        <GrFacebook
                          style={{ marginBottom: 2.5, marginRight: 12 }}
                        />
                      }
                      style={{ width: "100%" }}
                    >
                      Facebook
                    </Button>
                  </Col> */}
                </Row>
              </Form>
            </div>
            <div
              className="col-md-5 d-md-block d-sm-none d-none"
              style={{ justifyItems: "center" }}
            >
              <div>
                <img
                  src={addUserImage}
                  alt="Register"
                  height="300"
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

export default SignInPage;

import React from "react";
import { Typography, Row, Card, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Title } = Typography;

const buttonWidth = 100;

function RequireLogin({ restrictedAction }) {
  const { pathname } = useLocation();

  return (
    <Card className="white-button mb-4">
      <Row align="middle" justify="space-between">
        <Title style={{ margin: 0, padding: 0 }} level={4}>
          {`Login or register to ${restrictedAction}`}
        </Title>
        <Row>
          <Link to={`/signin?url=${encodeURIComponent(pathname)}`}>
            <Button
              style={{ width: buttonWidth }}
              className="orangesmoke-button mr-3"
              size="large"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              style={{ width: buttonWidth }}
              className="orange-button"
              size="large"
            >
              Register
            </Button>
          </Link>
        </Row>
      </Row>
    </Card>
  );
}

export default RequireLogin;

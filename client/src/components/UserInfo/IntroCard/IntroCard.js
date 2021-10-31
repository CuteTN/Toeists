import React from "react";
import OverviewRow from "../IntroCard/OverviewRow/OverviewRow.js";
import { useSelector } from "react-redux";

import {
  IoSchoolSharp,
  MdEmail,
  IoHome,
  FaMale,
  FaBirthdayCake,
  MdWork,
  FaPhoneSquareAlt,
} from "react-icons/all";
import { Row, Typography, Divider } from "antd";
import styles from "./styles.js";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";
import { isLoginUser } from "../../../utils/user";
import moment from "moment";

const { Text } = Typography;
const IntroCard = () => {
  const user = useSelector((state) => state.user);
  const isMyProfile = isLoginUser(user);

  const dateOfBirth = moment(user?.birthday).format("DD/MM/YYYY");
  const gender = user?.gender;
  const phoneNumber = user?.phoneNumber;
  const email = user?.email;

  const maxTextLength = 200;
  return (
    <Layout style={styles.backgroundheader}>
      <Row className="container">
        <Text style={styles.header}>Intro</Text>
      </Row>
      <Row
        className="row justify-content-center align-items-center"
        style={styles.bio}
      >
        <Text>Nắng bỏ đi nắng k về nữa </Text>
      </Row>
      <Divider style={{ justifySelf: "start" }}></Divider>
      <div className="row" style={styles.lineinfo}>
        <OverviewRow
          firstIcon={<FaPhoneSquareAlt style={styles.icon} />}
          text={phoneNumber}
        />

        <OverviewRow firstIcon={<MdEmail style={styles.icon} />} text={email} />

        {gender && (
          <OverviewRow
            firstIcon={<FaMale style={styles.icon} />}
            text={gender}
          />
        )}

        {dateOfBirth && (
          <OverviewRow
            firstIcon={<FaBirthdayCake style={styles.icon} />}
            text={dateOfBirth}
          />
        )}
      </div>
      {isMyProfile ? (
        <Row style={{ width: "100%", justifyContent: "center" }}>
          <Button
            className="orange-button"
            type="primary"
            style={styles.editBtn}
          >
            <Link to="/settings">Edit</Link>
          </Button>
        </Row>
      ) : (
        <></>
      )}
    </Layout>
    // <Layout style={{ backgroundColor: "white", width: 350, height: 350 }}>
    //   <Header>
    //     <Text style={{ fontSize: 28, fontWeight: 600, marginLeft: 30 }}>
    //       Intro
    //     </Text>
    //   </Header>
    //   <Content>Content</Content>
    //   <Footer>Footer</Footer>
    // </Layout>
  );
};

export default IntroCard;

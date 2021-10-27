import React from "react";
import OverviewRow from "../IntroCard/OverviewRow/OverviewRow.js";
import { useSelector } from "react-redux";

import {
  IoSchoolSharp,
  IoHome,
  FaMale,
  FaBirthdayCake,
  MdWork,
} from "react-icons/all";
import { Row, Typography } from "antd";
import styles from "./styles.js";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";
import { isLoginUser } from "../../../utils/user";
import moment from "moment";

const { Header, Footer, Sider, Content } = Layout;

// function InfoCard() {
//   const [selectedItem, setSelectedItem] = useState("1");
const { Text } = Typography;
const IntroCard = () => {
  //TODO: bug prone like user avatar when get from this so-called user redux
  const user = useSelector((state) => state.user);
  console.log("Thy", user);
  const isMyProfile = isLoginUser(user);
  if (isMyProfile) console.log("Thyyy");

  //   const dateOfBirth = moment(user?.userInfo?.dateOfBirth).format("DD/MM/YYYY");
  //   const address = user?.userInfo?.address;
  //   const gender = user?.userInfo?.gender;
  //   // educations la array, coi lai
  //   const educations = user?.userInfo?.educations;
  //   const works = user?.userInfo?.works;

  //   let education;
  //   if (educations) {
  //     education = educations[educations.length - 1];
  //   }
  //   let work;
  //   if (works) {
  //     work = works[works.length - 1];
  //   }

  //   if (!user) return <Loading />;
  //   console.log(address);

  const maxTextLength = 200;
  return (
    <Layout style={styles.backgroundheader}>
      <Row className="container">
        <Text style={styles.header}>Intro</Text>
      </Row>
      <div className="row" style={styles.lineinfo}>
        <OverviewRow
          firstIcon={<MdWork style={styles.icon} />}
          text="Leader at KMS"
        />

        <OverviewRow
          firstIcon={<IoSchoolSharp style={styles.icon} />}
          text="Student at UIT - HCM"
        />

        <OverviewRow
          firstIcon={<IoHome style={styles.icon} />}
          text="Tam Ky, Quang Nam"
        />

        <OverviewRow firstIcon={<FaMale style={styles.icon} />} text="Male" />

        {/* {dateOfBirth && (
          <OverviewRow
            firstIcon={<FaBirthdayCake style={styles.icon} />}
            text={dateOfBirth}
          />
        )} */}
      </div>

      <Row style={{ width: "100%", justifyContent: "center" }}>
        <Button className="orange-button" type="primary" style={styles.editBtn}>
          <Link>Edit</Link>
        </Button>
      </Row>

      {/* <div className="row">
        <Button type="primary" style={styles.editinfo}>
          Edit
        </Button>
      </div> */}
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

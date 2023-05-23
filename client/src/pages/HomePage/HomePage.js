import React from "react";
import { Layout, Row } from "antd";
import Navbar from "../../components/Navbar/Navbar";

const { Content } = Layout;

function HomePage() {
  return (
    <Layout>
      <Navbar />
    </Layout>
  );
}

export default HomePage;

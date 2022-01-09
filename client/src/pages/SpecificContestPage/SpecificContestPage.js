import React, { useEffect } from "react";
import { Layout, Card } from "antd";
//components
import Navbar from "../../components/Navbar/Navbar";
//api
// import { fetchAPost } from "../../services/api/forum.js";
//other
import styles from "./styles.js";
import TitleContest from "../../components/Contest/Title/TitleContest";

const SpecificForumPage = (props) => {
  useEffect(() => {
    fetchContest();
  }, []);

  const fetchContest = async () => {};

  return (
    <>
      <Layout>
        <Navbar />
        <div style={styles.mainArea} className="row">
          <div className="col-md-8 mb-4">
            <div>
              <Card style={{ padding: 16 }}>
                <div style={styles.item}>
                  <TitleContest />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SpecificForumPage;

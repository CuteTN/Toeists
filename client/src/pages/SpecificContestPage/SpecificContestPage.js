import React, { useEffect, useState } from "react";
import { Layout, Card, Button } from "antd";
import { useHistory } from "react-router-dom";
//components
import Navbar from "../../components/Navbar/Navbar";
//api
import { fetchAContest } from "../../services/api/contest";
//other
import styles from "./styles.js";
import TitleContest from "../../components/Contest/Title/TitleContest";
import ContestPart5 from "./Part5/ContestPart5";

const SpecificForumPage = (props) => {
  const history = useHistory();
  const { id } = props.match.params;
  const [contest, setContest] = useState(null);

  useEffect(() => {
    fetchContest();
  }, []);

  const fetchContest = async () => {
    fetchAContest(id)
      .then((res) => {
        setContest(res.data);
      })
      .catch((err) => {
        switch (err.response?.status) {
          case 404:
            history.push("/error404");
            break;
          case 403:
            history.push("/error403");
            break;
          default:
            history.push("/error404");
        }
      });
  };

  return (
    <>
      <Layout>
        <Navbar />
        <div style={styles.mainArea} className="row">
          <div className="col-md-8 mb-4">
            <div>
              <Card style={{ padding: 16 }}>
                <div style={styles.item}>
                  <TitleContest contest={contest} />
                  <hr />
                  <ContestPart5 contest={contest} />
                  <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Button
                      className="orange-button"
                      size="large"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  </div>
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

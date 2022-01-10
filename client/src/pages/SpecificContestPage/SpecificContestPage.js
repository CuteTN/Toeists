import React, { useEffect } from "react";
import { Layout, Card, Button } from "antd";
//components
import Navbar from "../../components/Navbar/Navbar";
//api
// import { fetchAPost } from "../../services/api/forum.js";
//other
import styles from "./styles.js";
import TitleContest from "../../components/Contest/Title/TitleContest";
import ContestPart5 from "./Part5/ContestPart5";

const SpecificForumPage = (props) => {
  useEffect(() => {
    fetchContest();
  }, []);

  const fetchContest = async () => {};
  const qs = {
    part: "Part 5",
    title: "Một cái title gì đó không biết nữa",
    listQS: [
      {
        question:
          "Customers who submit payments ——- March 10 will be charged a late fee.",
        answer: ["after ", "behind ", "quite ", "almost "],
        correct: "hihi",
      },
      {
        question:
          "The poll shows how often company executives make financial decisions that are ——- by employee opinions.",
        answer: ["trained ", "acted ", "reminded ", "influenced "],
        correct: "hihi",
      },
    ],
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
                  <TitleContest contest={qs} />
                  <hr />
                  <ContestPart5 contest={qs} />
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

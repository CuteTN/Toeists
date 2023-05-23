import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
//components
import Navbar from "../../components/Navbar/Navbar";
import TitleContest from "../../components/Contest/Title/TitleContest";
import ContestPart1 from "./Part1/ContestPart1";
import ContestPart2 from "./Part2/ContestPart2";
import ContestPart3 from "./Part3/ContestPart3";
import ContestPart4 from "./Part4/ContestPart4";
import ContestPart5 from "./Part5/ContestPart5";
import ContestPart6 from "./Part6/ContestPart6";
import ContestPart7 from "./Part7/ContestPart7";
//api
import { fetchAContest } from "../../services/api/contest";
import { submitToAContest } from "../../services/api/contest";
//other
import styles from "./styles.js";
import PersonalResultComponent from "./PersonalResult";

const SpecificContestPage = (props) => {
  const history = useHistory();
  const { id } = props.match.params;
  const [contest, setContest] = useState(null);
  const [answers, setAnswers] = useState([]);

  const personalResult = React.useMemo(() => contest?.submissions?.personal, [contest]);

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

  const handleSubmit = () => {
    submitToAContest(contest?._id, answers).then((res) => {
      window.location.reload();
    });
  };

  const handleAnswersChange = (ans) => {
    let refinedAns = [];
    Object.entries(ans ?? {}).forEach(([key, value]) => { console.log(key, value); refinedAns[key] = value })
    setAnswers(refinedAns);
  };

  const handleGoToContestList = () => {
    history.push("/contests")
  }

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
                  {contest?.part === 1 && (
                    <ContestPart1
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 2 && (
                    <ContestPart2
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 3 && (
                    <ContestPart3
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 4 && (
                    <ContestPart4
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 5 && (
                    <ContestPart5
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 6 && (
                    <ContestPart6
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  {contest?.part === 7 && (
                    <ContestPart7
                      contest={contest}
                      onChange={handleAnswersChange}
                    />
                  )}
                  <div>
                    <PersonalResultComponent contest={contest} />
                  </div>
                  <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Button
                      className="orange-button mr-4"
                      size="large"
                      onClick={handleGoToContestList}
                      hidden={!!personalResult}
                    >
                      Quit
                    </Button>

                    <Tooltip title={personalResult ? "You've already submitted to this contest." : "Submit your answers"}>
                      <Button
                        className="orange-button ml-4 mr-4"
                        size="large"
                        htmlType="submit"
                        onClick={handleSubmit}
                        disabled={!!personalResult}
                      >
                        Submit
                      </Button>
                    </Tooltip>

                    <Button
                      className="orange-button ml-4"
                      size="large"
                      onClick={handleGoToContestList}
                      hidden={!personalResult}
                    >
                      More contests
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

export default SpecificContestPage;

// libs
import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
// components
import { Navbar } from "../../../components";
import QuestionComponent from "./QuestionComponent/QuestionComponent";
//others
import styles from "../styles";
import "../style.css";

const { Text } = Typography;
const CreatContestPart7 = () => {
  const [listQuestion, setListQuestion] = useState([
    <QuestionComponent key={0} />,
  ]);

  const handleClick = () => {};
  const handleCreate = () => {};

  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <div style={styles.qsArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <div className="row">
                <div
                  style={{
                    paddingLeft: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 36, fontWeight: 700 }}>Part 7</Text>
                </div>
              </div>
              <hr />
              {listQuestion.map((component, i) => (
                <React.Fragment key={i}>{component}</React.Fragment>
              ))}

              <div className="functional-button">
                <Button
                  className="orange-button"
                  style={{ fontWeight: "bold", margin: 15 }}
                  onClick={handleClick}
                >
                  ADD PARAGRAPH
                </Button>
                <Button
                  className="orange-button"
                  style={{ fontWeight: "bold" }}
                  onClick={handleCreate}
                >
                  CREATE
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatContestPart7;

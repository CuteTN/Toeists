// libs
import React from "react";
import { Card, Button } from "antd";
import { useHistory } from "react-router-dom";
// components
import Navbar from "../../components/Navbar/Navbar";
//others
import styles from "./styles";
import "./style.css";

const CreateContestPage = () => {
  const history = useHistory();
  const title = [
    "Part 1",
    "Part 2",
    "Part 3",
    "Part 4",
    "Part 5",
    "Part 6",
    "Part 7",
  ];

  const handleClick = (id) => {
    history.push(`/content/create/part${id}`);
  };
  return (
    <div className="create-contest-page-wrapper">
      <Navbar />
      <div style={styles.mainArea} className="row">
        <div className="col-md-8 mb-4">
          <div>
            <Card>
              <div style={{ fontSize: 30, fontWeight: 600 }}>LISTENING</div>
              {title.slice(0, 4).map((title, i) => (
                <Button
                  key={i}
                  className="orange-button"
                  style={{ width: 150, height: 50, margin: 30, fontSize: 24 }}
                  onClick={() => {
                    handleClick(i + 1);
                  }}
                >
                  {title}
                </Button>
              ))}
              <div style={{ fontSize: 30, marginTop: 70, fontWeight: 600 }}>
                READING
              </div>
              {title.slice(4, 7).map((title, i) => (
                <Button
                  key={i}
                  className="orange-button"
                  style={{ width: 150, height: 50, margin: 30, fontSize: 24 }}
                  onClick={() => {
                    handleClick(i + 5);
                  }}
                >
                  {title}
                </Button>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateContestPage;

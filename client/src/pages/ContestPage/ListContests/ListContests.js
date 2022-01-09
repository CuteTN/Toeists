import React, { useState, useEffect, useCallback } from "react";
import { Row, Typography } from "antd";
import styles from "./styles";
import Contest from "../../../components/Contest/Contest";

const { Text } = Typography;

function ListContests({ creatorId, hasMarginLeft }) {
  const [listContests, setListContests] = useState([]);
  /** @type {[]} */
  const qs = {
    part: "Part 5",
    title: "Một cái title gì đó không biết nữa",
    listQS: [
      {
        question: "đahạdhsdddddddddddddddddddđ",
        answer: ["aaaaaaa", "bbbbbbb", "ccccccc", "dddddd"],
        correct: "aaaaaaa",
      },
      {
        question: "đahạdhsdddddddddddddddddddđ",
        answer: ["aaaaaaa", "bbbbbbb", "ccccccc", "dddddd"],
        correct: "aaaaaaa",
      },
    ],
  };
  useEffect(() => {}, [creatorId]);

  return (
    <div>
      <Row
        style={
          hasMarginLeft
            ? { ...styles.postsBox, padding: "24px 24px 0" }
            : styles.postsBox
        }
      >
        <Contest contest={qs} />
      </Row>
    </div>
  );
}

export default ListContests;

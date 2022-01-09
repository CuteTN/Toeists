import React, { useState, useEffect, useCallback } from "react";
import { Row, Typography } from "antd";
import styles from "./styles";
import { useHistory } from "react-router-dom";

import FeedPost from "../../../components/FeedPost/FeedPost";

const { Text } = Typography;

function ListContests({ creatorId, hasMarginLeft }) {
  const [listContests, setListContests] = useState([]);
  /** @type {[]} */
  const qs = {
    part: "part 5",
    title: "Thy Thy Thy Thy Thy Thy Thy Thy",
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
  const list = [qs, qs, qs];
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
        {creatorId === undefined
          ? listContests?.map((post) => <FeedPost key={post._id} post={post} />)
          : listContests?.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
      </Row>
    </div>
  );
}

export default ListContests;

//libs
import React, { useState, useEffect, useCallback } from "react";
import { Row, Typography } from "antd";
//components
import Contest from "../../../components/Contest/Contest";
//api
import { fetchAllContests } from "../../../services/api/contest";
//others
import styles from "./styles";
const { Text } = Typography;

function ListContests({ hasMarginLeft }) {
  const [listContests, setListContests] = useState([]);
  /** @type {[]} */

  useEffect(() => {
    fetchAllContests()
      .then((res) => {
        if (res.data instanceof Array) setListContests(res.data);
        else setListContests([]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  /** @type {[]} */

  // useEffect(() => {}, [creatorId]);

  return (
    <div>
      <Row
        style={
          hasMarginLeft
            ? { ...styles.postsBox, padding: "24px 24px 0" }
            : styles.postsBox
        }
      >
        {listContests?.map((contest) => (
          <Contest key={contest._id} contest={contest} />
        ))}
        {/* <Contest contest={qs} /> */}
      </Row>
    </div>
  );
}

export default ListContests;

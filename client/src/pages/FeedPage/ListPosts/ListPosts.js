import React, { useState, useEffect, useCallback } from "react";
import { Row, Typography } from "antd";
import styles from "./styles";
import { useHistory } from "react-router-dom";
import { fetchForums } from "../../../services/api/forum";

import FeedPost from "../../../components/FeedPost/FeedPost";

const { Text } = Typography;

function ListPosts({ setCurrentId, hasMarginLeft }) {
  const [listPosts, setListPosts] = useState([]);
  /** @type {[]} */

  useEffect(() => {
    fetchForums()
      .then((res) => {
        console.log("report", res.data);
        if (res.data instanceof Array) setListPosts(res.data);
        else setListPosts([]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <Row
        style={
          hasMarginLeft
            ? { ...styles.postsBox, padding: "24px 24px 0" }
            : styles.postsBox
        }
      >
        {listPosts?.map((post) => (
          <FeedPost key={post._id} post={post} />
        ))}
      </Row>
    </div>
  );
}

export default ListPosts;

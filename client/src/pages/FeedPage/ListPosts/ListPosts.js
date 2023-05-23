import React, { useState, useEffect, useCallback } from "react";
import { Row, Typography } from "antd";
import styles from "./styles";
import { useHistory } from "react-router-dom";
import { fetchForums } from "../../../services/api/forum";

import FeedPost from "../../../components/FeedPost/FeedPost";
import { useQuery } from "../../../hooks/useQuery";
import { searchForForum } from "../../../services/api/search";

const { Text } = Typography;

function ListPosts({ creatorId, hasMarginLeft, isSearchMode = false }) {
  /** @type {[]} */
  const [listPosts, setListPosts] = useState([]);

  const query = useQuery();

  useEffect(() => {
    if (isSearchMode)
      searchForForum(query.get("search"), 10)
        .then((res) => {
          if (res.data?.data instanceof Array) setListPosts(res.data?.data);
          else setListPosts([]);
        })
        .catch((e) => {
          console.error(e);
        });
    else
      fetchForums(creatorId)
        .then((res) => {
          if (res.data instanceof Array) setListPosts(res.data);
          else setListPosts([]);
        })
        .catch((e) => {
          console.error(e);
        });
  }, [creatorId, isSearchMode, query.get("search")]);

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
          ? listPosts?.map((post) => <FeedPost key={post._id} post={post} />)
          : listPosts?.map((post) => <FeedPost key={post._id} post={post} />)}
      </Row>
    </div>
  );
}

export default ListPosts;

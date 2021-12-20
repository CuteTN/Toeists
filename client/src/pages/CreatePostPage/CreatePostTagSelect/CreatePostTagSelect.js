import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Select } from "antd";
//api
import { fetchHashtag } from "../../../services/api/hashtag";
//orthers
import createPostStyle from "../styles.js";
const { Option } = Select;

const CreatePostTagSelect = ({ onChange, defaultTags }) => {
  const [listHashtags, setListHashtags] = useState([]);
  /** @type {[]} */

  useEffect(() => {
    fetchHashtag()
      .then((res) => {
        console.log("report", res.data);
        if (res.data instanceof Array) setListHashtags(res.data);
        else setListHashtags([]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Select
      mode="tags"
      // size={size}
      value={defaultTags}
      placeholder="# Hashtags"
      onChange={onChange}
      style={{ width: "100%", ...createPostStyle.editorFont }}
    >
      {listHashtags.map((tag, i) => (
        <Option key={tag?.name ?? i}>{tag?.name}</Option>
      ))}
    </Select>
  );
};

export default CreatePostTagSelect;

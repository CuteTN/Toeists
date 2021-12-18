import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import createPostStyle from "../styles.js";
import { Select } from "antd";
const { Option } = Select;

const CreatePostTagSelect = ({ onChange, defaultTags }) => {
  const dispatch = useDispatch();
  /** @type {[]} */

  const listHashtags = ["Reading", "Listening"];

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
        <Option key={i}>{tag}</Option>
      ))}
    </Select>
  );
};

export default CreatePostTagSelect;

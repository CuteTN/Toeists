import React from "react";
import createPostStyle from "../styles.js";
import { Input } from "antd";

function CreatePostTitleInput({ title, setTitle }) {
  const handleTextChange = (value) => {
    setTitle(value.target.value);
  };

  return (
    <div>
      <Input
        placeholder="/* Title */"
        value={title}
        onChange={handleTextChange}
        style={createPostStyle.editorFont}
        maxLength={100}
      />
    </div>
  );
}

export default CreatePostTitleInput;

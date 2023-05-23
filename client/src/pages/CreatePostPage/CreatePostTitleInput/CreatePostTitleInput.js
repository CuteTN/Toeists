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
        placeholder="Provide a title for your post..."
        value={title}
        onChange={handleTextChange}
        style={createPostStyle.editorFont}
        maxLength={100}
      />
    </div>
  );
}

export default CreatePostTitleInput;

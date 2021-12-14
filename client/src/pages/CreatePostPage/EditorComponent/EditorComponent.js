import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Input, Button } from "antd";
import CreatePostPrivacySelect from "../CreatePostPrivacySelect/CreatePostPrivacySelect";
import CreatePostTagSelect from "../CreatePostTagSelect/CreatePostTagSelect";
//others
import "./style.css";

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postSpace, setPostSpace] = useState(""); // just text
  const [postPrivacy, setPostPrivacy] = useState("");
  const [listHashtagNames, setListHashtagNames] = useState([]);

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID ##clientid###");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        console.log(error);
        reject(error);
      });
    });
  };

  const onEditorStateChange = (editorState) => {
    // console.log(editorState)
    setEditorState(editorState);
  };
  return (
    <div className="editor-component-wrapper">
      <h2>Create Post</h2>
      <Input placeholder="Title" />
      <div className="input-title">
        <div className="col-12">
          <CreatePostTagSelect
            onChange={setListHashtagNames}
            defaultTags={listHashtagNames ?? []}
          />
        </div>
        <div className="col-3">
          <CreatePostPrivacySelect
            postSpace={postSpace}
            postPrivacy={postPrivacy}
            setPostPrivacy={setPostPrivacy}
          />
        </div>
        <div className="col-3">
          <Button
            className="orange-button"
            style={{ width: "100%", fontWeight: "bold" }}
          >
            PUBLISH
          </Button>
        </div>
      </div>

      <div className="editor">
        <Editor
          editorState={editorState}
          // editorStyle={{ height: "100px" }}
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              uploadCallback: uploadImageCallBack(),
              alt: { present: true, mandatory: true },
            },
          }}
        />
      </div>
    </div>
  );
};
export default EditorComponent;

// libs
import React, { useState } from "react";
import { message, Button } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
// components
import TextEditor from "./TextEditor";
import CreatePostPrivacySelect from "../CreatePostPrivacySelect/CreatePostPrivacySelect";
import CreatePostTagSelect from "../CreatePostTagSelect/CreatePostTagSelect";
import CreatePostTitleInput from "../CreatePostTitleInput/CreatePostTitleInput";
// api
import * as forumAPI from "../../../services/api/forum";
//others
import "./style.css";

const EditorComponent = () => {
  const [postTitle, setPostTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postSpace, setPostSpace] = useState(""); // just text
  const [postPrivacy, setPostPrivacy] = useState("");
  const [listHashtagNames, setListHashtagNames] = useState([]);
  const [convertedContent, setConvertedContent] = useState(null);

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

  const wrapPostData = () => {
    console.log("thy", convertedContent);
    const result = {
      title: postTitle?.trim?.(),
      content: convertedContent,
      // privacy: postPrivacy,
      hashtagNames: listHashtagNames,
    };
    return result;
  };

  const checkPostData = (post) => {
    const errorResult = (message) => ({
      isValid: false,
      message,
    });

    if (!post) return errorResult("Something when wrong.");
    if (!post.title) return errorResult("A post must have a title.");
    if (!post.content) return errorResult("A post must have some content.");

    return {
      isValid: true,
      message: null,
    };
  };
  const convertContentToHTML = () => {
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setConvertedContent(currentContentAsHTML);
  };

  const handleSavePostButtonClick = () => {
    convertContentToHTML();

    const newPost = wrapPostData();

    const validation = checkPostData(newPost);
    if (!validation.isValid) {
      message.error(validation.message, 1);
      return;
    }

    forumAPI
      .createForum(newPost)
      .then((res) => {
        console.log("Thy xinh dep");
        // history.push(`/forums/${res.data._id}`);
      })
      .catch((error) => {
        message.error("Something goes wrong. Check all fields", 2);
        console.log(error);
      });
  };
  return (
    <div className="editor-component-wrapper">
      <h2>Create Post</h2>
      <CreatePostTitleInput title={postTitle} setTitle={setPostTitle} />
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
            onClick={handleSavePostButtonClick}
            className="orange-button"
            style={{ width: "100%", fontWeight: "bold" }}
          >
            PUBLISH
          </Button>
        </div>
      </div>

      <div className="editor">
        <TextEditor editorState={editorState} setEditorState={setEditorState} />
      </div>
    </div>
  );
};
export default EditorComponent;

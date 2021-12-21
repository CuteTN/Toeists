// libs
import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useHistory } from "react-router-dom";
// components
import TextEditor from "./TextEditor";
import CreatePostPrivacySelect from "../CreatePostPrivacySelect/CreatePostPrivacySelect";
import CreatePostTagSelect from "../CreatePostTagSelect/CreatePostTagSelect";
import CreatePostTitleInput from "../CreatePostTitleInput/CreatePostTitleInput";
// api
import * as forumAPI from "../../../services/api/forum";
//others
import "./style.css";

const EditorComponent = ({ post }) => {
  const [postTitle, setPostTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postSpace, setPostSpace] = useState(""); // just text
  const [postPrivacy, setPostPrivacy] = useState("");
  const [listHashtagNames, setListHashtagNames] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (post) {
      //check đăng nhập
      setPostTitle(post?.title ?? "");
      setPostPrivacy(post?.privacy ?? "");
      setListHashtagNames(post?.hashtags?.map((tag) => tag?.name));
      // setEditorState(createMarkup(post?.content));
      // console.log("ty", convertFromHTML(post?.content));
      const blocksFromHTML = convertFromHTML(post?.content);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
    }
  }, []);

  const wrapPostData = () => {
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const result = {
      title: postTitle,
      content: currentContentAsHTML,
      privacy: postPrivacy,
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

  const handleSavePostButtonClick = () => {
    const newPost = wrapPostData();

    const validation = checkPostData(newPost);
    if (!validation.isValid) {
      message.error(validation.message, 1);
      return;
    }

    if (!post) {
      forumAPI
        .createForum(newPost)
        .then((res) => {
          history.push(`/forums/${res.data._id}`);
        })
        .catch((error) => {
          message.error("Something goes wrong. Check all fields", 2);
          console.log(error);
        });
    } else {
      forumAPI
        .updateForum(post?._id, newPost)
        .then((res) => {
          history.push(`/forums/${post?._id}`);
        })
        .catch((error) => {
          message.error("Something goes wrong. Check all fields", 2);
          console.log(error);
        });
    }
  };
  return (
    <div className="editor-component-wrapper">
      <h2 className="page-title">
        {post ? "Edit your post" : "Create a post"}
      </h2>
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

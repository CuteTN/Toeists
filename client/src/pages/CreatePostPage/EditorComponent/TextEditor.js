import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "draft-js/dist/Draft.css";

const TextEditor = ({ editorState, setEditorState }) => {
  const handleEditorChange = (state) => {
    setEditorState(state);
  };

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

  return (
    <div>
      <div className="col-12">
        <Editor
          // editorStyle={{ height: "350px" }}
          placeholder="Enter some text..."
          editorState={editorState}
          // toolbarClassName="toolbarClassName"
          // wrapperClassName="wrapperClassName"
          // editorClassName="editorClassName"
          onEditorStateChange={handleEditorChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: false },
            textAlign: { inDropdown: false },
            link: { inDropdown: false },
            history: { inDropdown: false },
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: true, mandatory: true },
            },
          }}
          // wrapperStyle={{ height: "400px", scrollSnapType: "" }}
          editorStyle={{ maxHeight: "350px", minHeight: "350px" }}
        />
      </div>
      {/* <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(convertedContent)}
      ></div> */}
    </div>
  );
};
export default TextEditor;

import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";

const TextEditor = ({ editorState, setEditorState }) => {
  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  return (
    <div>
      <div className="col-12">
        <Editor
          placeholder="Enter some text..."
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={handleEditorChange}
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

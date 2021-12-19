// libs
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import EditorComponent from "./EditorComponent/EditorComponent";
import "./style.css";

const CreatePostPage = () => {
  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <EditorComponent />
    </div>
  );
};
export default CreatePostPage;

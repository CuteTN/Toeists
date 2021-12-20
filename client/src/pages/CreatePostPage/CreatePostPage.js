// libs
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import EditorComponent from "./EditorComponent/EditorComponent";
import { useLocation } from "react-router";
import "./style.css";

const CreatePostPage = () => {
  const location = useLocation();
  const { post } = location.state ?? {};
  console.log("thyyy", post);
  return (
    <div className="create-post-page-wrapper">
      <Navbar />
      <EditorComponent post={post} />
    </div>
  );
};
export default CreatePostPage;

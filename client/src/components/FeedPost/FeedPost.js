import React from "react";
import OwnerInformation from "../FullPost/OwnerInformation/OwnerInformation";
import HashTagForum from "../FullPost/HashTagForum/HashTagForum";
import TitleForum from "./Title/TitleForum";
import ReactionComponent from "./ReactionComponent/ReactionComponent";
import styles from "./styles";

const FeedPost = ({ post }) => {
  return (
    <div>
      <div style={styles.item}>
        <OwnerInformation post={post} />
        <HashTagForum post={post} />
        <TitleForum post={post} />
        <ReactionComponent post={post} />
      </div>
    </div>
  );
};

export default FeedPost;

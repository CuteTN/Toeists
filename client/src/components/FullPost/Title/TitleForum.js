import React from "react";
import { Typography } from "antd";
import DOMPurify from "dompurify";

const { Title } = Typography;

const TitleForum = ({ post }) => {
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div className="break-word">
      <Title level={2}>{post?.title}</Title>

      <div
        className="pb-2"
        dangerouslySetInnerHTML={createMarkup(post?.content)}
      ></div>
    </div>
  );
};

export default TitleForum;

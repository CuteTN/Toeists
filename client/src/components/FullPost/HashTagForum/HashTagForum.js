import React from "react";
import { Row, Tag, Tooltip } from "antd";
import styles from "./styles";

const HashTagForum = ({ post }) => {
  console.log("thy ", post?.hashtags);
  return (
    <div style={styles.item}>
      <Row className="mb-1">
        {post?.hashtags.map((item, i) => (
          <Tooltip
            key={i}
            title={`Mentioned ${item?.count} time${item?.count > 1 ? "s" : ""}`}
          >
            <Tag className="mb-2 tag">{item.name}</Tag>
          </Tooltip>
        ))}
      </Row>
    </div>
  );
};

export default HashTagForum;

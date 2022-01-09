import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ConversationCard } from "./ConversationCard";
//others
import COLOR from "../../../constants/colors";
import "./style.css";
import styles from "./styles.js";
const ListConversations = ({ conversations, onConversationClick }) => {
  const handleConversationClick = React.useCallback(
    (conversation) => {
      onConversationClick?.(conversation);
    },
    [onConversationClick]
  );

  const handleSearch = () => {};

  return (
    <div className="list-conversations-wrapper">
      <div className="search-conversation">
        <Input
          className="search-container"
          onPressEnter={() => handleSearch()}
          allowClear
          suffix={
            <SearchOutlined
              onClick={() => handleSearch()}
              style={{ fontSize: 24, color: COLOR.black }}
            />
          }
          // ref={searchInputRef}
          bordered={false}
          style={styles.input}
          placeholder="Search"
          defaultValue={""}
        />
      </div>
      <div className="list-conversation">
        {conversations?.map((c, i) => (
          <ConversationCard
            key={i}
            conversation={c}
            onClick={handleConversationClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ListConversations;

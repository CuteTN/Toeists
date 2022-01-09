import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ConversationCard } from "./ConversationCard";
//others
import COLOR from "../../../constants/colors";
import "./style.css";
import styles from "./styles.js";
import { searchForConversations } from "../../../services/api/search";
const ListConversations = ({ conversations, onConversationClick }) => {
  const [searchText, setSearchText] = React.useState("");

  const [searchedConversations, setSearchedConversations] = React.useState(null);

  const shownConversations = React.useMemo(() => {
    return searchedConversations ?? conversations 
  }, [conversations, searchedConversations])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText)
        searchForConversations(searchText, 5)
          .then(res => {
            setSearchedConversations(res.data.data);
          })
      else
        setSearchedConversations(null);
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchText, conversations])

  const handleConversationClick = React.useCallback(
    (conversation) => {
      onConversationClick?.(conversation);
    },
    [onConversationClick]
  );

  const handleSearch = () => { };

  return (
    <div className="list-conversations-wrapper">
      <div className="search-conversation">
        <Input
          className="search-container"
          onPressEnter={() => handleSearch()}
          allowClear
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
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
        {shownConversations?.map((c, i) => (
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

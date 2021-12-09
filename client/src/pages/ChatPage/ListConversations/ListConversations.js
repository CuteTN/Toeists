import React from "react";
import { ConversationCard } from "./ConversationCard";
//others
import "./style.css";

const ListConversations = ({ conversations, onConversationClick }) => {
  const handleConversationClick = React.useCallback((conversation) => {
    onConversationClick?.(conversation);
  }, []);

  return (
    <div className="list-conversations-wrapper">
      {conversations?.map((c, i) =>
        <ConversationCard key={i} conversation={c} onClick={handleConversationClick}/>)
      }
    </div>
  );
}

export default ListConversations;

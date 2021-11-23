// libs
import React from "react";
// component
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";
import InputChat from "./InputChat";
import ListFriend from "./ListFriend";
import { Navbar } from "../../components";
// others
import "./index.css";

const ChatPage = () => (
  <div className="chat-wrapper">
    <Navbar />
    <ListFriend />
    <MessageHeader />
    <MessageForm />
    <InputChat />
  </div>
);
export default ChatPage;

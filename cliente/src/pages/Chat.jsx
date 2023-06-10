import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { ChatContainer, Contacts, Welcome } from "../components/Chat";
import { Aside } from "../components/Home";
import NavResponsive from "../components/Navbar/NavResponsive";
import Wrapper from "../wrapper/wrapper";
function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const { user, userData, followedUserData } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.current = io(
        "https://socialapp-backend-production-a743.up.railway.app"
      );
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Aside />
      <div className=" bg-white shadow-md overflow-y-hidden dark:bg-[#1e1f23] grid grid-cols-[25%,75%] xl:col-start-2 max-xl:row-start-1 ">
        <Contacts contacts={followedUserData} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
      <div className="row-start-2">
        <NavResponsive />
      </div>
    </>
  );
}
export default Wrapper(
  Chat,
  "relative h-screen grid grid-cols-[300px,1fr] max-xl:grid-cols-[1fr] max-xl:grid-rows-[1fr,50px]"
);

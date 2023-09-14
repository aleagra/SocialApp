import React, { useEffect, useState, useRef, useContext } from "react";
import { io as socketIOClient } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { ChatContainer, Contacts, Welcome } from "../components/Chat";
import { Aside } from "../components/Home";
import NavResponsive from "../components/Navbar/NavResponsive";
import Wrapper from "../wrapper/wrapper";
import { hostLink } from "../utilities/host";
function Chat() {
  const socket = useRef();
  const [currentChat, setCurrentChat] = useState(undefined);
  const { user, followedUserData } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.current = socketIOClient(`${hostLink}`);
      socket.current.emit("add-user", user);
    }
  }, [user]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Aside />
      <div className=" bg-white shadow-md  dark:bg-[#1e1f23] grid grid-cols-[25%,75%] max-2xl:grid-cols-[35%,65%] xl:col-start-2 max-xl:row-start-1">
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
  "grid grid-cols-[300px,1fr] overflow-y-hidden max-xl:grid-cols-[1fr] max-xl:grid-rows-[1fr,50px]"
);
